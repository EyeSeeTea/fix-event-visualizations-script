import _ from "lodash";
import { D2Api, MetadataPick } from "@eyeseetea/d2-api/2.36";
import { Async } from "domain/entities/Async";
import { EventReportRepository } from "domain/repositories/EventReportRepository";
import { getFieldsAsString } from "@eyeseetea/d2-api/api/common";
import { EventReport } from "domain/entities/EventReport";

export class EventReportD2Repository implements EventReportRepository {
    constructor(private api: D2Api) {}

    async getCorrupted(): Async<EventReport[]> {
        const eventReports = await this.api
            .get<{
                eventReports: D2EventReport[];
            }>("/eventReports", {
                paging: false,
                fields: getFieldsAsString(eventReportFields),
            })
            .map(({ data }) => data.eventReports)
            .getData();

        return eventReports.map(e => this.buildEventReport(e));
    }

    private buildEventReport(d2EventReport: D2EventReport): EventReport {
        return d2EventReport;
    }
}

const eventReportFields = {
    id: true,
    program: true,
    programStage: true,
    dataElementDimensions: {
        programStage: {
            id: true,
        },
        dataElement: {
            id: true,
        },
    },
} as const;

type D2EventReport = MetadataPick<{
    eventReports: { fields: typeof eventReportFields };
}>["eventReports"][number];
