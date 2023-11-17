import { Async } from "domain/entities/Async";
import { EventReport } from "domain/entities/EventReport";
import { EventReportsExportRepository } from "domain/repositories/EventReportsExportRepository";

export class ExportCorruptedEventReports {
    constructor(private eventReportsExportRepository: EventReportsExportRepository) {}
    execute(eventReports: EventReport[]): Async<void> {
        return this.eventReportsExportRepository.save(eventReports);
    }
}
