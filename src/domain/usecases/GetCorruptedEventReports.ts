import { Async } from "domain/entities/Async";
import { EventReport } from "domain/entities/EventReport";
import { EventReportRepository } from "domain/repositories/EventReportRepository";

export class GetCorruptedEventReports {
    constructor(private eventReportRepository: EventReportRepository) {}

    execute(): Async<EventReport[]> {
        const eventReports$ = this.eventReportRepository.getAll();
        const programStagesIds$ = eventReports$.then(eventReports =>
            eventReports.map(r => r.programStage.id)
        );
        programStagesIds$.then(x => console.log(x));
        return eventReports$;
    }
}
