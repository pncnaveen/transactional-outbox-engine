import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserHandler } from "../commandHandler/createUser.handler.js";
import { CreateUserCommand } from "../command/createUser.command.js";


export type CreateUserRequestDTO = {
    firstName: string;
    lastName: string;
    email: string;
}

@Controller("users")
export class UserController {
    constructor(private readonly userHandler: CreateUserHandler) { }

    @Post()
    async createUser(@Body() body: CreateUserRequestDTO): Promise<void> {
        try {
            const createUserCommand: CreateUserCommand = new CreateUserCommand(body.firstName, body.lastName, body.email);
            await this.userHandler.execute(createUserCommand);
        } catch (error) {
            console.error(error);
        }
    }
}