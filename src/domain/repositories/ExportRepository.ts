export interface ExportRepository {
    saveCsv(payload: Object, outputFile: string): void;
}
