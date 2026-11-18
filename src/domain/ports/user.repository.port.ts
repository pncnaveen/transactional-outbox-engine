import { OutboxMessage } from "../entities/outboxMessage.entity.js";
import { User } from "../entities/user.entity.js";

export interface UserRepositoryPort {
    save(user: User, outboxMessage: OutboxMessage): Promise<boolean>;
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");