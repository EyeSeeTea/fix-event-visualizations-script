import _ from "lodash";
import { D2Api, MetadataPick } from "@eyeseetea/d2-api/2.36";
import { Async } from "domain/entities/Async";
import { ProgramStageRepository } from "domain/repositories/ProgramStageRepository";
import { ProgramStage } from "domain/entities/ProgramStage";
import { Id } from "domain/entities/Base";

export class ProgramStageD2Repository implements ProgramStageRepository {
    constructor(private api: D2Api) {}

    async getByIds(ids: Id[]): Async<ProgramStage[]> {
        return await this.api.models.programStages
            .get({
                paging: false,
                fields: programStageFields,
                filter: { id: { in: ids } },
            })
            .map(({ data }) => data.objects.map(e => this.buildProgramStage(e)))
            .getData();
    }

    private buildProgramStage(d2ProgramStage: D2ProgramStage): ProgramStage {
        return {
            ...d2ProgramStage,
            dataElements: d2ProgramStage.programStageDataElements.map(({ dataElement }) => dataElement),
        };
    }
}

const programStageFields = {
    id: true,
    program: true,
    programStageDataElements: {
        dataElement: {
            id: true,
        },
    },
} as const;

type D2ProgramStage = MetadataPick<{
    programStages: { fields: typeof programStageFields };
}>["programStages"][number];
