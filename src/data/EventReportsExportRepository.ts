import _ from "lodash";
import fs from "fs";
import { EventReportsExportRepository } from "domain/repositories/EventReportsExportRepository";
import { EventReport } from "domain/entities/EventReport";

export class EventReportsExportFileRepository implements EventReportsExportRepository {
    save(eventReports: EventReport[], outputFile: string) {
        const payload = { eventReports };
        const jsonBackup = JSON.stringify(payload, null, 4);
        fs.writeFileSync(outputFile, jsonBackup);
    }
}
