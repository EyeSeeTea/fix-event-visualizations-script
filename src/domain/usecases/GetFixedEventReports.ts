import { EventReport } from "domain/entities/EventReport";
import { EventReportsRepository } from "domain/repositories/EventReportsRepository";

export class GetFixedEventReports {
    constructor(private eventReportRepository: EventReportsRepository) {}
    execute(eventReports: EventReport[]): EventReport[] {
        return this.eventReportRepository.fixEventReports(eventReports);
    }
}
