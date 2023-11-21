import _ from "lodash";
import { command, flag, subcommands } from "cmd-ts";
import { getApiUrlOptions, getD2Api } from "scripts/common";
import { UserD2Repository } from "data/UserD2Repository";
import { FixEventReportsUseCase } from "domain/usecases/FixEventReportsUseCase";
import { EventReportD2Repository } from "data/EventReportD2Repository";
import { ExportFileRepository } from "data/ExportFileRepository";

export function getCommand() {
    const corruptedEventReports = command({
        name: "corrupted event reports",
        description: "get corrupted event reports",
        args: {
            ...getApiUrlOptions(),
            post: flag({
                long: "post",
                description: "Send payload to DHIS2 API. If not present, generates JSON payload.",
            }),
        },
        handler: async args => {
            const api = getD2Api(args.url);
            const { post } = args;
            const eventReportRepository = new EventReportD2Repository(api);
            const userRepository = new UserD2Repository(api);
            const eventReportExportRepository = new ExportFileRepository();
            await new FixEventReportsUseCase(
                eventReportRepository,
                eventReportExportRepository,
                userRepository
            ).execute(post);
        },
    });

    return subcommands({
        name: "event-reports",
        cmds: { fixCorrupted: corruptedEventReports },
    });
}
