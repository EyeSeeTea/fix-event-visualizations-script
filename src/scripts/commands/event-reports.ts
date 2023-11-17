import _ from "lodash";
import { command, flag, subcommands } from "cmd-ts";
import { getApiUrlOptions, getD2Api } from "scripts/common";
import { GetCorruptedEventReports } from "domain/usecases/GetCorruptedEventReports";
import { GetFixedEventReports } from "domain/usecases/GetFixedEventReports";
import { EventReportsD2Repository } from "data/EventReportsD2Repository";
import logger from "utils/log";

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
            logger.debug("Fetching corrupted event reports...");
            const eventReportsRepository = new EventReportsD2Repository(api);
            const eventReports = await new GetCorruptedEventReports(eventReportsRepository).execute();
            const fixedEventReports = new GetFixedEventReports(eventReportsRepository).execute(eventReports);
            await new ExportCorruptedEventReports(fixedEventReports);
            const payload = { fixedEventReports };
            logger.info(`Corrupted Event Reports: ${eventReports.length}`);
            logger.info(`Payload: ${JSON.stringify(payload)}`);
        },
    });

    return subcommands({
        name: "event-reports",
        cmds: { corrupted: corruptedEventReports },
    });
}
