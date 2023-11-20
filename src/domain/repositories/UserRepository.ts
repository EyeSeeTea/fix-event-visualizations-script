import { Async } from "domain/entities/Async";
import { Id } from "domain/entities/Base";
import { User } from "domain/entities/User";

export interface UserRepository {
    getCurrent(): Async<User>;
    getAllIds(): Async<Id[]>;
}
