// import { Async } from "domain/entities/Async";
// import { Id, Ref } from "domain/entities/Base";
// import { EventReport } from "domain/entities/EventReport";
// import { ProgramStage } from "domain/entities/ProgramStage";
// import { EventReportRepository } from "domain/repositories/EventReportRepository";
// import { ProgramStageRepository } from "domain/repositories/ProgramStageRepository";
// import _ from "lodash";
// import { first, isEmpty, uniq } from "lodash";

// export class GetCorruptedEventReports {
//     constructor(
//         private eventReportRepository: EventReportRepository,
//         private programStageRepository: ProgramStageRepository
//     ) {}

//     async execute(): Async<EventReport[]> {
//         const eventReports = (await this.eventReportRepository.getAll()).filter(
//             ev => !isEmpty(ev.dataElementDimensions)
//         );

//         const programStageIds = uniq(eventReports.map(r => r.programStage.id));
//         const dimensionProgramStageIds = uniq(
//             eventReports.flatMap(r => r.dataElementDimensions.map(d => d.programStage.id))
//         );

//         const programStages = await this.programStageRepository.getByIds(programStageIds);
//         const maybeCorruptedProgramStages = await this.programStageRepository.getByIds(
//             dimensionProgramStageIds
//         );

//         // const x = orderBy(
//         //     eventReports.map(ev => ({
//         //         id: ev.id,
//         //         program: ev.program.id,
//         //         programStage: ev.programStage.id,
//         //         pairProgramStage: uniq(ev.dataElementDimensions.map(d => d.programStage.id))[0],
//         //         sameProgramStage:
//         //             ev.programStage.id === uniq(ev.dataElementDimensions.map(d => d.programStage.id))[0],
//         //     })),
//         //     x => !x.sameProgramStage
//         // );
//         // x.forEach(a => console.log(a.program, a.programStage, a.pairProgramStage, a.sameProgramStage));

//         const corruptedEventReports: [EventReport, Matches][] = eventReports.map(ev => {
//             const noPairs = ev.dataElementDimensions.length === 0;
//             const pairsProgramStages = uniq(ev.dataElementDimensions.map(pair => pair.programStage.id));
//             const pairsDataElementsIds = ev.dataElementDimensions.map(pair => pair.dataElement.id);
//             const multipleProgramStages = pairsProgramStages.length > 1;
//             const pairProgramStageId = first(pairsProgramStages);

//             const programStage = programStages.find(p => p.id === ev.programStage.id);
//             const pairProgramStage = maybeCorruptedProgramStages.find(p => p.id === pairProgramStageId);
//             const programStageDataElements = programStage?.dataElements;
//             const pairProgramStageDataElements = pairProgramStage?.dataElements;

//             return [
//                 ev,
//                 {
//                     dataElementInPairProgramStage: Boolean(
//                         pairProgramStageDataElements?.some(de => pairsDataElementsIds.includes(de.id))
//                     ),
//                     dataElementInProgramStage: Boolean(
//                         programStageDataElements?.some(de => pairsDataElementsIds?.includes(de.id))
//                     ),
//                     programStageIsInProgram: programStage?.program.id === ev.program.id,
//                     pairProgramStageIsSameProgramStage: pairProgramStage?.id === ev.programStage.id,
//                     pairProgramStageProgramIsSameProgram: pairProgramStage?.program.id === ev.program.id,
//                     multipleProgramStages,
//                     noPairs,
//                 },
//             ];
//         });

//         // const a = _.compact(
//         //     corruptedEventReports.map(([ev, m]) => {
//         //         if (m.noPairs) return;
//         //         if (m.multipleProgramStages) {
//         //             console.log("--- VERY WRONG event ---");
//         //             return;
//         //         }
//         //         if (
//         //             m.pairProgramStageProgramIsSameProgram &&
//         //             m.pairProgramStageIsSameProgramStage &&
//         //             m.dataElementInPairProgramStage &&
//         //             m.dataElementInProgramStage
//         //         )
//         //             return; //VALID EVENT

//         //         // if (m.dataElementInPairProgramStage && m.pairProgramStageIsInProgram && m.pairProgramStageIsSameProgramStage) {
//         //         //     console.log("--- VALID event ---");
//         //         //     return;
//         //         // }
//         //         // if (m.dataElementInPairProgramStage && m.pairProgramStageIsInProgram && !m.pairProgramStageIsSameProgramStage) {
//         //         //     console.log("--- NOT VALID event program stage ---");
//         //         //     return;
//         //         // }
//         //         // if (m.dataElementInPairProgramStage && m.pairProgramStageIsInProgram && !m.pairProgramStageIsSameProgramStage) {
//         //         //     console.log("--- NOT VALID event program stage ---");
//         //         //     return;
//         //         // }
//         //         // if ()
//         //         if (m.pairProgramStageProgramIsSameProgram) return ev;
//         //         // console.log(m.pairProgramStageProgramIsSameProgram ? "VALID" : "NOT VALID");
//         //     })
//         // );
//         // console.log(JSON.stringify(a[0]));

//         const a = _.compact(
//             corruptedEventReports.map(([ev, m]) => {
//                 if (m.noPairs) return;
//                 if (m.multipleProgramStages) {
//                     console.log("--- VERY WRONG event ---");
//                     return;
//                 }
//                 if (
//                     m.pairProgramStageProgramIsSameProgram &&
//                     m.pairProgramStageIsSameProgramStage &&
//                     m.dataElementInPairProgramStage &&
//                     m.dataElementInProgramStage
//                 )
//                     return; //VALID EVENT

//                 // if (m.dataElementInPairProgramStage && m.pairProgramStageIsInProgram && m.pairProgramStageIsSameProgramStage) {
//                 //     console.log("--- VALID event ---");
//                 //     return;
//                 // }
//                 // if (m.dataElementInPairProgramStage && m.pairProgramStageIsInProgram && !m.pairProgramStageIsSameProgramStage) {
//                 //     console.log("--- NOT VALID event program stage ---");
//                 //     return;
//                 // }
//                 // if (m.dataElementInPairProgramStage && m.pairProgramStageIsInProgram && !m.pairProgramStageIsSameProgramStage) {
//                 //     console.log("--- NOT VALID event program stage ---");
//                 //     return;
//                 // }
//                 // if ()
//                 if (!m.dataElementInPairProgramStage || !m.pairProgramStageProgramIsSameProgram) return "x";
//                 // console.log(m.pairProgramStageProgramIsSameProgram ? "VALID" : "NOT VALID");
//             })
//         );
//         console.log(a.length);

//         return eventReports;
//     }
// }

// function matchProgram(eventReport: EventReport, programStage: ProgramStage) {
//     return eventReport.program.id === programStage.program.id;
// }

// function matchProgramStage(eventReport: EventReport, programStage: ProgramStage) {
//     return eventReport.programStage.id === programStage.id;
// }

// function programStageContainsDataElement(programStage: ProgramStage, dataElement: Ref) {
//     return programStage.dataElements.some(de => de.id === dataElement.id);
// }

// interface Matches {
//     dataElementInPairProgramStage: boolean;
//     dataElementInProgramStage: boolean;
//     pairProgramStageIsSameProgramStage: boolean;
//     pairProgramStageProgramIsSameProgram: boolean;
//     programStageIsInProgram: boolean;
//     multipleProgramStages: boolean;
//     noPairs: boolean;
// }
