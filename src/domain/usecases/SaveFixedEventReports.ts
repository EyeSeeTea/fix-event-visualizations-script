import { Stats } from "@eyeseetea/d2-api/api";
import { Async } from "domain/entities/Async";
import { EventReport } from "domain/entities/EventReport";
import { EventReportsRepository } from "domain/repositories/EventReportsRepository";
import { UserRepository } from "domain/repositories/UserRepository";

export class SaveFixedEventReports {
    constructor(
        private eventReportRepository: EventReportsRepository,
        private userRepository: UserRepository
    ) {}

    async execute(eventReports: EventReport[]): Async<Stats> {
        const validIds = await this.userRepository.getAllIds();

        return this.eventReportRepository.save(eventReports, validIds);
    }
}
