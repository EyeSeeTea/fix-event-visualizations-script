import { Async } from "domain/entities/Async";
import { BasicUser, User } from "domain/entities/User";

export interface UserRepository {
    getCurrent(): Async<User>;
    getAll(): Async<BasicUser[]>;
}
