import { Async } from "domain/entities/Async";
import { EventReport } from "domain/entities/EventReport";

export interface EventReportRepository {
    getAll(): Async<EventReport[]>;
}
