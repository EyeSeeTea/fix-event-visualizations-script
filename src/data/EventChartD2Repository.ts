import { chunk } from "lodash";
import { D2Api, MetadataPick, PostOptions } from "@eyeseetea/d2-api/2.36";
import { EventChartRepository } from "domain/repositories/EventChartRepository";
import { EventChart } from "domain/entities/EventChart";
import { Async } from "domain/entities/Async";
import { Stats } from "domain/entities/Stats";
import { promiseMap, runMetadata } from "./dhis2-utils";

export class EventChartD2Repository implements EventChartRepository {
    constructor(private api: D2Api) {}

    async getAll(): Async<EventChart[]> {
        return this.api.models.eventCharts
            .get({
                paging: false,
                fields: eventChartFields,
            })
            .map(({ data }) => data.objects.map(e => this.buildEventChart(e)))
            .getData();
    }

    async save(eventCharts: EventChart[], post?: boolean): Async<Stats> {
        const chunks = chunk(eventCharts, 100);
        const accStats = await promiseMap(chunks, eventCharts =>
            runMetadata(this.api.metadata.post({ eventCharts }, post ? options : validateOptions)).then(
                r => r.stats
            )
        ).then(stats =>
            stats.reduce((acc, v) => ({
                created: acc.created + v.created,
                updated: acc.updated + v.updated,
                deleted: acc.deleted + v.deleted,
                ignored: acc.ignored + v.ignored,
                total: acc.total + v.total,
            }))
        );

        return accStats;
    }

    private buildEventChart(d2EventChart: D2EventChart): EventChart {
        return d2EventChart;
    }
}

const eventChartFields = {
    $all: true,
} as const;

type D2EventChart = MetadataPick<{
    eventCharts: { fields: typeof eventChartFields };
}>["eventCharts"][number];

const validateOptions: Partial<PostOptions> = {
    async: false,
    importMode: "VALIDATE",
    importStrategy: "UPDATE",
};

const options: Partial<PostOptions> = {
    async: false,
    importMode: "COMMIT",
    importStrategy: "UPDATE",
};
