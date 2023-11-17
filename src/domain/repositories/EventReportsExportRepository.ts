import { EventReport } from "domain/entities/EventReport";

export interface EventReportsExportRepository {
    save(eventReports: EventReport[], outputFile: string): void;
}
