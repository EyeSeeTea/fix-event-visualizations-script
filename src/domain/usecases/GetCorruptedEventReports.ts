import { isEmpty } from "lodash";
import { Async } from "domain/entities/Async";
import { EventReport } from "domain/entities/EventReport";
import { EventReportsRepository } from "domain/repositories/EventReportsRepository";

export class GetCorruptedEventReports {
    constructor(private eventReportRepository: EventReportsRepository) {}

    async execute(): Async<EventReport[]> {
        const corruptedEventReports = (await this.eventReportRepository.getAll())
            .filter(ev => !isEmpty(ev.dataElementDimensions))
            .filter(
                ev => !ev.dataElementDimensions.map(pair => pair.programStage.id).includes(ev.programStage.id)
            );

        return corruptedEventReports;
    }
}
