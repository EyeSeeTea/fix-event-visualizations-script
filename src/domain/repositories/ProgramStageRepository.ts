import { Async } from "domain/entities/Async";
import { Id } from "domain/entities/Base";
import { ProgramStage } from "domain/entities/ProgramStage";

export interface ProgramStageRepository {
    getByIds(ids: Id[]): Async<ProgramStage[]>;
}
