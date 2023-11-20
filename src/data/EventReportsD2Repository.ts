import _ from "lodash";
import { D2Api, MetadataPick, MetadataResponse, PostOptions, Stats } from "@eyeseetea/d2-api/2.36";
import { Async } from "domain/entities/Async";
import { EventReportsRepository } from "domain/repositories/EventReportsRepository";
import { EventReport } from "domain/entities/EventReport";
import { runMetadata } from "./dhis2-utils";
import { Id } from "domain/entities/Base";

export class EventReportsD2Repository implements EventReportsRepository {
    constructor(private api: D2Api) {
        // process.on("unhandledRejection", (reason, promise) => {
        //     console.error("Unhandled Rejection at:", promise, "reason:", reason);
        //     // You can add additional logging or error handling here
        //     // For example, you might want to throw an error or terminate the process
        // });
    }

    async getAll(): Async<EventReport[]> {
        return this.api.models.eventReports
            .get({
                paging: false,
                fields: eventReportFields,
            })
            .map(({ data }) => data.objects.map(e => this.buildEventReport(e)))
            .getData();
    }

    fixEventReports(eventReports: EventReport[]): EventReport[] {
        return eventReports.map(ev => ({
            ...ev,
            dataElementDimensions: ev.dataElementDimensions.map(pair => ({
                ...pair,
                programStage: { id: ev.programStage.id },
            })),
        }));
    }

    async save(eventReports: EventReport[], validUsers: Id[]): Async<Stats> {
        const temp = eventReports.filter(ev => ev.userAccesses.every(u => validUsers.includes(u.id)));

        const chunks = _.chunk(temp, 100);
        const calls = chunks.map(eventReports =>
            runMetadata(this.api.metadata.post({ eventReports }, options))
        );

        return sequentially(calls).then(stats =>
            stats.reduce((acc, v) => ({
                created: acc.created + v.created,
                updated: acc.updated + v.updated,
                deleted: acc.deleted + v.deleted,
                ignored: acc.ignored + v.ignored,
                total: acc.total + v.total,
            }))
        );
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

const options: Partial<PostOptions> = {
    async: false,
    importMode: "VALIDATE",
    importStrategy: "UPDATE",
};

const sequentially = (promises: Promise<MetadataResponse>[]): Promise<Stats[]> => {
    const stats: Stats[] = [];
    return promises
        .reduce(
            (acc, v) =>
                acc.then(() =>
                    v.then(r => {
                        stats.push(r.stats);
                    })
                ),
            Promise.resolve()
        )
        .then(() => stats);
};
