import { Async } from "domain/entities/Async";
import { EventReport } from "domain/entities/EventReport";

export interface EventReportsExportRepository {
    save(eventReports: EventReport[]): Async<void>;
}
