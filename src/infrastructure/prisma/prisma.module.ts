import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";
import { USER_REPOSITORY } from "../../domain/ports/user.repository.port.js";
import { PrismaUserRepository } from "../persistence/prismaUser.repository.js";
import { OUTBOX_MESSAGES_REPOSITORY } from "../../domain/ports/outboxMessages.repository.port.js";
import { PrismaOutboxMessageRepository } from "../persistence/prismaOutboxMessage.repository.js";

@Module({
    providers: [PrismaService, { provide: USER_REPOSITORY, useClass: PrismaUserRepository }, { provide: OUTBOX_MESSAGES_REPOSITORY, useClass: PrismaOutboxMessageRepository }],
    exports: [PrismaService, USER_REPOSITORY, OUTBOX_MESSAGES_REPOSITORY]
})
export class PrismaModule { }