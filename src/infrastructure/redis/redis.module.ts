import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service.js";
import { EVENT_PUBLISH } from "../../domain/ports/eventPublish.port.js";
import { PubSubRepository } from "../pub-sub/pubSub.repository.js";
import { ConfigModule } from "@nestjs/config";
import { OUTBOX_MESSAGES_REPOSITORY } from "../../domain/ports/outboxMessages.repository.port.js";
import { PrismaOutboxMessageRepository } from "../persistence/prismaOutboxMessage.repository.js";
import { PrismaModule } from "../prisma/prisma.module.js";

@Module({
    providers: [RedisService, { provide: EVENT_PUBLISH, useClass: PubSubRepository }, 
        { provide: OUTBOX_MESSAGES_REPOSITORY, useClass: PrismaOutboxMessageRepository }],
    exports: [RedisService, EVENT_PUBLISH],
    imports: [ConfigModule, PrismaModule],
})
export class RedisModule { }