import _ from "lodash";
import * as CsvWriter from "csv-writer";
import { Async } from "domain/entities/Async";
import {
    EventReportsExportRepository,
} from "domain/repositories/EventReportExportReportRepository";

export class ExportReportCsvRepository implements EventReportsExportRepository {
    async save()

    private async saveCsv(options: { outputPath: string; rows: Row[]; headers: Headers }): Async<void> {
        const { outputPath, rows, headers } = options;
        const createCsvWriter = CsvWriter.createObjectCsvWriter;
        const csvHeader = _.map(headers, (obj, key) => ({ id: key, ...obj }));
        const csvWriter = createCsvWriter({ path: outputPath, header: csvHeader });
        await csvWriter.writeRecords(rows);
    }
}

type Row = Record<string, string>;
type Headers = Record<keyof Row, { title: string }>;


const headers: Headers = {
    eventReportId: { title: "Event Report ID" },
    previousProgramStage: { title: "Previous Program Stage" },
    updateProgramStage: { title: "Program Stage for Update" },
};

outputPath: "corrup-event-reports.csv",
headers,
rows: eventReports.map(ev => {
    const previousProgramStage = first(
        uniq(ev.dataElementDimensions.map(de => de.programStage.id))
    );
    return {
        eventReportId: ev.id,
        previousProgramStage: previousProgramStage,
        updateProgramStage: ev.programStage.id,
    };
}),