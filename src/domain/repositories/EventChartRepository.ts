import { Async } from "domain/entities/Async";
import { EventChart } from "domain/entities/EventChart";
import { Stats } from "domain/entities/Stats";

export interface EventChartRepository {
    getAll(): Async<EventChart[]>;
    save(eventCharts: EventChart[], post?: boolean): Async<Stats>;
}
