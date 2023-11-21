import { compact, isEmpty } from "lodash";
import { Async } from "domain/entities/Async";
import { EventChart } from "domain/entities/EventChart";
import { EventChartRepository } from "domain/repositories/EventChartRepository";
import { UserRepository } from "domain/repositories/UserRepository";
import { ExportRepository } from "domain/repositories/ExportRepository";
import { Id } from "domain/entities/Base";
import logger from "utils/log";

export class FixEventChartsUseCase {
    constructor(
        private eventChartRepository: EventChartRepository,
        private exportRepository: ExportRepository,
        private userRepository: UserRepository
    ) {}

    async execute(post: boolean): Async<void> {
        logger.debug("Fetching corrupted event charts...");
        const corruptedEventCharts = (await this.eventChartRepository.getAll())
            .filter(ev => !isEmpty(ev.dataElementDimensions))
            .filter(
                ev => !ev.dataElementDimensions.map(pair => pair.programStage.id).includes(ev.programStage.id)
            );
        logger.info(`Corrupted Event Charts: ${corruptedEventCharts.length}`);

        const fixedEventCharts = corruptedEventCharts.map(ev => fixEventChart(ev));

        const outputFile = "fixed-event-charts.json";
        this.exportRepository.saveCsv({ eventCharts: fixedEventCharts }, outputFile);
        logger.info(`Written payload: ${outputFile}`);

        //DHIS2 BUG PATCH: userAccesses not updated on deleted users
        const validUsersIds = (await this.userRepository.getAll()).map(user => user.id);
        const eventCharts = fixedEventCharts.map(ev => {
            const invalid = compact(ev.userAccesses.map(ua => !validUsersIds.includes(ua.id) && ua.id));
            if (!isEmpty(invalid)) {
                logger.warn(
                    `The event chart ${ev.id} had the following invalid user accesses: ${invalid.join(", ")}`
                );
                return removeinvalidUserAccess(ev, validUsersIds);
            }

            return ev;
        });

        const stats = await this.eventChartRepository.save(eventCharts, post);
        logger.info(`Event Charts that ${post ? "have been" : "will be"}: ${JSON.stringify(stats, null, 4)}`);
    }
}

function fixEventChart(eventChart: EventChart): EventChart {
    return {
        ...eventChart,
        dataElementDimensions: eventChart.dataElementDimensions.map(pair => ({
            ...pair,
            programStage: { id: eventChart.programStage.id },
        })),
    };
}

function removeinvalidUserAccess(eventChart: EventChart, validUsersIds: Id[]) {
    return {
        ...eventChart,
        userAccesses: eventChart.userAccesses.filter(ua => validUsersIds.includes(ua.id)),
    };
}
