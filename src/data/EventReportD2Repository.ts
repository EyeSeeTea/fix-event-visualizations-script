import _ from "lodash";
import { D2Api } from "@eyeseetea/d2-api/2.36";
import { Async } from "domain/entities/Async";
import { EventReportRepository } from "domain/repositories/EventReportRepository";

export class EventReportD2Repository implements EventReportRepository {
    constructor(private api: D2Api) {}

    async getCorrupted(): Async<any[]> {
        const x = await this.api.get("eventReports");
        return [];
    }
}
