import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";
import { USER_REPOSITORY } from "../../domain/ports/user.repository.port.js";
import { PrismaUserRepository } from "../persistence/prismaUser.repository.js";

@Module({
    providers: [PrismaService, {provide: USER_REPOSITORY, useClass: PrismaUserRepository}],
    exports: [PrismaService, USER_REPOSITORY]
})
export class PrismaModule{}