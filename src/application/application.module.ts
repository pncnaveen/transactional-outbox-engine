import { Module } from "@nestjs/common";
import { UserController } from "./controller/user.controller.js";
import { CreateUserHandler } from "./commandHandler/createUser.handler.js";
import { PrismaModule } from "../infrastructure/prisma/prisma.module.js";
import { RedisModule } from "../infrastructure/redis/redis.module.js";


@Module({
    imports: [PrismaModule, RedisModule],
    controllers: [UserController],
    providers: [CreateUserHandler]
})
export class ApplicationModule { }