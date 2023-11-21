import _ from "lodash";
import { command, flag, subcommands } from "cmd-ts";
import { getApiUrlOptions, getD2Api } from "scripts/common";
import { UserD2Repository } from "data/UserD2Repository";
import { FixEventChartsUseCase } from "domain/usecases/FixEventChartsUseCase";
import { EventChartD2Repository } from "data/EventChartD2Repository";
import { ExportFileRepository } from "data/ExportFileRepository";

export function getCommand() {
    const corruptedEventCharts = command({
        name: "corrupted event charts",
        description: "get corrupted event charts",
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
            const eventChartRepository = new EventChartD2Repository(api);
            const userRepository = new UserD2Repository(api);
            const eventChartExportRepository = new ExportFileRepository();
            await new FixEventChartsUseCase(
                eventChartRepository,
                eventChartExportRepository,
                userRepository
            ).execute(post);
        },
    });

    return subcommands({
        name: "event-charts",
        cmds: { fixCorrupted: corruptedEventCharts },
    });
}
