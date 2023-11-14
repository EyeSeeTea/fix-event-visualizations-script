import { Async } from "domain/entities/Async";
import { EventReport } from "domain/entities/EventReport";

export interface EventReportRepository {
    getCorrupted(): Async<EventReport[]>;
}
