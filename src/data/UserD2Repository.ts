import _ from "lodash";
import { D2Api, MetadataPick } from "@eyeseetea/d2-api/2.36";
import { Async } from "domain/entities/Async";
import { UserRepository } from "domain/repositories/UserRepository";
import { BasicUser, User } from "domain/entities/User";
import { promiseMap } from "./dhis2-utils";

export class UserD2Repository implements UserRepository {
    constructor(private api: D2Api) {}
    async getCurrent(): Async<User> {
        const response = await this.api.currentUser
            .get({
                fields: userFields,
            })
            .getData();

        return this.buildUser(response);
    }

    async getAll(): Async<BasicUser[]> {
        const { objects: firstPageUsers, pager } = await this.api.models.users
            .get({
                fields: { id: true },
                pageSize: 1_000,
            })
            .getData();

        const users = await promiseMap([...Array(pager.pageCount - 1).keys()], page =>
            this.api.models.users
                .get({
                    fields: { id: true },
                    page: page + 2,
                    pageSize: 1_000,
                })
                .getData()
                .then(data => data.objects)
        ).then(users => [firstPageUsers, ...users].flat());

        return users;
    }

    private buildUser(d2User: D2User) {
        return new User({
            id: d2User.id,
            name: d2User.displayName,
            userGroups: d2User.userGroups,
            ...d2User.userCredentials,
        });
    }
}

const userFields = {
    id: true,
    displayName: true,
    userGroups: { id: true, name: true },
    userCredentials: {
        username: true,
        userRoles: { id: true, name: true, authorities: true },
    },
} as const;

type D2User = MetadataPick<{ users: { fields: typeof userFields } }>["users"][number];
