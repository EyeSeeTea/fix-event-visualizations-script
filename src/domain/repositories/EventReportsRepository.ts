import { Stats } from "@eyeseetea/d2-api/api";
import { Async } from "domain/entities/Async";
import { Id } from "domain/entities/Base";
import { EventReport } from "domain/entities/EventReport";

export interface EventReportsRepository {
    getAll(): Async<EventReport[]>;
    fixEventReports(eventReports: EventReport[]): EventReport[];
    save(eventReports: EventReport[], validUsers: Id[]): Async<Stats>;
}
