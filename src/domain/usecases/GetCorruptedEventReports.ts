import { Async } from "domain/entities/Async";
import { EventReport } from "domain/entities/EventReport";
import { EventReportRepository } from "domain/repositories/EventReportRepository";

export class GetCorruptedEventReports {
    constructor(private eventReportRepository: EventReportRepository) {}

    execute(): Async<EventReport[]> {
        return this.eventReportRepository.getCorrupted();
    }
}
