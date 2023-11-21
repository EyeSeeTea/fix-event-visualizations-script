import { compact, isEmpty } from "lodash";
import { Async } from "domain/entities/Async";
import { EventReport } from "domain/entities/EventReport";
import { EventReportRepository } from "domain/repositories/EventReportRepository";
import { UserRepository } from "domain/repositories/UserRepository";
import { ExportRepository } from "domain/repositories/ExportRepository";
import { Id } from "domain/entities/Base";
import logger from "utils/log";

export class FixEventReportsUseCase {
    constructor(
        private eventReportRepository: EventReportRepository,
        private exportRepository: ExportRepository,
        private userRepository: UserRepository
    ) {}

    async execute(post: boolean): Async<void> {
        logger.debug("Fetching corrupted event reports...");
        const corruptedEventReports = (await this.eventReportRepository.getAll())
            .filter(ev => !isEmpty(ev.dataElementDimensions))
            .filter(
                ev => !ev.dataElementDimensions.map(pair => pair.programStage.id).includes(ev.programStage.id)
            );
        logger.info(`Corrupted Event Reports: ${corruptedEventReports.length}`);

        const fixedEventReports = corruptedEventReports.map(ev => fixEventReport(ev));

        const outputFile = "fixed-event-reports.json";
        this.exportRepository.saveCsv({ eventReports: fixedEventReports }, outputFile);
        logger.info(`Written payload: ${outputFile}`);

        //DHIS2 BUG PATCH: userAccesses not updated on deleted users
        const validUsersIds = (await this.userRepository.getAll()).map(user => user.id);
        const eventReports = fixedEventReports.map(ev => {
            const invalid = compact(ev.userAccesses.map(ua => !validUsersIds.includes(ua.id) && ua.id));
            if (!isEmpty(invalid)) {
                logger.warn(
                    `The event report ${ev.id} had the following invalid user accesses: ${invalid.join(", ")}`
                );
                return removeinvalidUserAccess(ev, validUsersIds);
            }

            return ev;
        });

        const stats = await this.eventReportRepository.save(eventReports, post);
        logger.info(
            `Event Reports that ${post ? "have been" : "will be"}: ${JSON.stringify(stats, null, 4)}`
        );
    }
}

function fixEventReport(eventReport: EventReport): EventReport {
    return {
        ...eventReport,
        dataElementDimensions: eventReport.dataElementDimensions.map(pair => ({
            ...pair,
            programStage: { id: eventReport.programStage.id },
        })),
    };
}

function removeinvalidUserAccess(eventReport: EventReport, validUsersIds: Id[]) {
    return {
        ...eventReport,
        userAccesses: eventReport.userAccesses.filter(ua => validUsersIds.includes(ua.id)),
    };
}
