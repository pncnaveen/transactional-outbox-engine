import { Inject, Injectable } from "@nestjs/common";
import { ulid } from "ulid";
import { USER_REPOSITORY, UserRepositoryPort } from "../../domain/ports/user.repository.port.js";
import { CreateUserCommand } from "../command/createUser.command.js";
import { User } from "../../domain/entities/user.entity.js";
import { EventType, MessageStatus, OutboxMessage } from "../../domain/entities/outboxMessage.entity.js";

@Injectable()
export class CreateUserHandler {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort) { }

    async execute(createUserCommand: CreateUserCommand): Promise<boolean> {
        try {
            const user: User = {
                id: ulid(),
                firstName: createUserCommand.firstName,
                lastName: createUserCommand.lastName,
                email: createUserCommand.email,
            }
            const outboxMessage: OutboxMessage = {
                id: ulid(),
                eventType: EventType.USER_CREATED,
                messsageStatus: MessageStatus.PROCESSING,
                account: user
            }
            const isSavedUser: boolean = await this.userRepo.save(user, outboxMessage);
            // this.eventPublish.publishEvent({
            //     eventType: "USER_CREATED",
            //     data: {
            //         userId: savedUser.id,
            //         email: savedUser.email
            //     }
            // });
            return isSavedUser;
        } catch (error) {
            throw error;
        }

    }
}