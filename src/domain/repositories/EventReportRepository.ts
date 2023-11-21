import { Async } from "domain/entities/Async";
import { EventReport } from "domain/entities/EventReport";
import { Stats } from "domain/entities/Stats";

export interface EventReportRepository {
    getAll(): Async<EventReport[]>;
    save(eventReports: EventReport[], post?: boolean): Async<Stats>;
}
