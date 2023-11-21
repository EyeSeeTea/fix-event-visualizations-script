import { command, subcommands } from "cmd-ts";
import { UserD2Repository } from "data/UserD2Repository";
import { getApiUrlOption, getD2Api } from "scripts/common";
import { GetCurrentUserUseCase } from "domain/usecases/GetCurrentUserUseCase";

export function getCommand() {
    const currentUser = command({
        name: "current user",
        description: "get current user information",
        args: {
            url: getApiUrlOption(),
        },
        handler: async args => {
            const api = getD2Api(args.url);
            const userRepository = new UserD2Repository(api);
            new GetCurrentUserUseCase(userRepository).execute();
        },
    });

    return subcommands({
        name: "users",
        cmds: { current: currentUser },
    });
}
