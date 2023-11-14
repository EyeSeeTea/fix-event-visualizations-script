import _ from "lodash";
import { command, subcommands } from "cmd-ts";
import { getApiUrlOptions, getD2Api } from "scripts/common";
import { EventReportD2Repository } from "data/EventReportD2Repository";
import { GetCorruptedEventReports } from "domain/usecases/GetCorruptedEventReports";
import logger from "utils/log";

export function getCommand() {
    const corruptedEventReports = command({
        name: "corrupted event reports",
        description: "get corrupted event reports",
        args: getApiUrlOptions(),
        handler: async args => {
            const api = getD2Api(args.url);
            const eventReportRepository = new EventReportD2Repository(api);
            logger.debug("Fetching corrupted event reports...");
            const eventReports = await new GetCorruptedEventReports(eventReportRepository).execute();
            eventReports.map(event => logger.info(`${JSON.stringify(event)}`));
        },
    });

    return subcommands({
        name: "event-reports",
        cmds: { corrupted: corruptedEventReports },
    });
}
