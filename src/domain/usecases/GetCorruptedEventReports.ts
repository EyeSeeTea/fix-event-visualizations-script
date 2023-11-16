import { isEmpty } from "lodash";
import { Async } from "domain/entities/Async";
import { EventReport } from "domain/entities/EventReport";
import { EventReportRepository } from "domain/repositories/EventReportRepository";

export class GetCorruptedEventReports {
    constructor(private eventReportRepository: EventReportRepository) {}

    async execute(): Async<EventReport[]> {
        const eventReports = (await this.eventReportRepository.getAll()).filter(
            ev => !isEmpty(ev.dataElementDimensions)
        );

        const corruptedEventReports = eventReports.filter(
            ev => !ev.dataElementDimensions.map(pair => pair.programStage.id).includes(ev.programStage.id)
        );

        console.log(corruptedEventReports.length);

        return eventReports;
    }
}
