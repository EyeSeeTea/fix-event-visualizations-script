import { Ref } from "./Base";

export interface ProgramStage extends Ref {
    program: Ref;
    dataElements: Ref[];
}
