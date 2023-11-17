import _ from "lodash";
import { D2Api, MetadataPick } from "@eyeseetea/d2-api/2.36";
import { Async } from "domain/entities/Async";
import { EventReportsRepository } from "domain/repositories/EventReportsRepository";
import { EventReport } from "domain/entities/EventReport";

export class EventReportsD2Repository implements EventReportsRepository {
    constructor(private api: D2Api) {}

    async getAll(): Async<EventReport[]> {
        return await this.api.models.eventReports
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
            dataElementDimensions: ev.dataElementDimensions.map(({ dataElement }) => ({
                programStage: { id: ev.programStage.id },
                dataElement,
            })),
        }));
    }

    async save(eventReports: EventReport[]): Async<any> {
        return [];
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
