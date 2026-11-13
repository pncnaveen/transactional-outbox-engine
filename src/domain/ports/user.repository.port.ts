import { User } from "../entities/user.entity.js";

export interface UserRepositoryPort {
    save(user: User): Promise<User>;
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");