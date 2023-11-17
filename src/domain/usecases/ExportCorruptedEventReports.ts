import { EventReport } from "domain/entities/EventReport";
import { EventReportsExportRepository } from "domain/repositories/EventReportsExportRepository";

export class ExportCorruptedEventReports {
    constructor(private eventReportsExportRepository: EventReportsExportRepository) {}
    execute(eventReports: EventReport[], outputFile: string): void {
        return this.eventReportsExportRepository.save(eventReports, outputFile);
    }
}
