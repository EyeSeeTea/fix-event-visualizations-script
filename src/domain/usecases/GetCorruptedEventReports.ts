import { Async } from "domain/entities/Async";
import { EventReportRepository } from "domain/repositories/EventReportRepository";

export class GetCorruptedEventReports {
    constructor(private eventReportRepository: EventReportRepository) {}

    execute(): Async<any[]> {
        return this.eventReportRepository.getCorrupted();
    }
}
