import { Inject, Injectable } from "@nestjs/common";
import { ulid } from "ulid";
import { USER_REPOSITORY, UserRepositoryPort } from "../../domain/ports/user.repository.port.js";
import { CreateUserCommand } from "../command/createUser.command.js";
import { User } from "../../domain/entities/user.entity.js";
import { EVENT_PUBLISH, EventPublishPort } from "../../domain/ports/eventPublish.port.js";

@Injectable()
export class CreateUserHandler {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepo: UserRepositoryPort, @Inject(EVENT_PUBLISH) private readonly eventPublish: EventPublishPort) { }

    async execute(createUserCommand: CreateUserCommand): Promise<User> {
        try {
            const user: User = {
                id: ulid(),
                firstName: createUserCommand.firstName,
                lastName: createUserCommand.lastName,
                email: createUserCommand.email,
            }
            const savedUser: User = await this.userRepo.save(user);
            this.eventPublish.publishEvent({
                eventType: "USER_CREATED",
                data: {
                    userId: savedUser.id,
                    email: savedUser.email
                }
            });
            return savedUser;
        } catch (error) {
            throw error;
        }

    }
}