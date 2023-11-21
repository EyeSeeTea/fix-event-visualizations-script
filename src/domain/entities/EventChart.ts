import { Ref } from "./Base";

export interface EventChart extends Ref {
    program: Ref;
    programStage: Ref;
    dataElementDimensions: {
        programStage: Ref;
        dataElement: Ref;
    }[];
    userAccesses: Ref[];
}
