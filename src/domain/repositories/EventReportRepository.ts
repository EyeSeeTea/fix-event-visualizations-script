import { Async } from "domain/entities/Async";

export interface EventReportRepository {
    getCorrupted(): Async<any[]>;
}
