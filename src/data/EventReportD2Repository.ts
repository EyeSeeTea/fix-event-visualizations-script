import { chunk } from "lodash";
import { D2Api, MetadataPick, PostOptions } from "@eyeseetea/d2-api/2.36";
import { EventReportRepository } from "domain/repositories/EventReportRepository";
import { EventReport } from "domain/entities/EventReport";
import { Async } from "domain/entities/Async";
import { Stats } from "domain/entities/Stats";
import { promiseMap, runMetadata } from "./dhis2-utils";

export class EventReportD2Repository implements EventReportRepository {
    constructor(private api: D2Api) {}

    async getAll(): Async<EventReport[]> {
        return this.api.models.eventReports
            .get({
                paging: false,
                fields: eventReportFields,
            })
            .map(({ data }) => data.objects.map(e => this.buildEventReport(e)))
            .getData();
    }

    async save(eventReports: EventReport[], post?: boolean): Async<Stats> {
        const chunks = chunk(eventReports, 100);
        const accStats = await promiseMap(chunks, eventReports =>
            runMetadata(this.api.metadata.post({ eventReports }, post ? options : validateOptions)).then(
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

    private buildEventReport(d2EventReport: D2EventReport): EventReport {
        return d2EventReport;
    }
}

const eventReportFields = {
    $all: true,
} as const;

type D2EventReport = MetadataPick<{
    eventReports: { fields: typeof eventReportFields };
}>["eventReports"][number];

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
