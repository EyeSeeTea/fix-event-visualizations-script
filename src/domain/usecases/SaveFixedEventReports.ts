import { Stats } from "@eyeseetea/d2-api/api";
import { Async } from "domain/entities/Async";
import { EventReport } from "domain/entities/EventReport";
import { EventReportsRepository } from "domain/repositories/EventReportsRepository";

export class SaveFixedEventReports {
    constructor(private eventReportRepository: EventReportsRepository) {}

    async execute(eventReports: EventReport[]): Async<Stats> {
        return await this.eventReportRepository.save(eventReports);
    }
}
