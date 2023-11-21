import { ExportRepository } from "domain/repositories/ExportRepository";
import fs from "fs";
export class ExportFileRepository implements ExportRepository {
    saveCsv(payload: Object, outputFile: string) {
        const jsonBackup = JSON.stringify(payload, null, 4);
        fs.writeFileSync(outputFile, jsonBackup);
    }
}
