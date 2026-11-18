import { Module } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service.js";
import { SchedulerBootstrapService } from "./scheduler.bootstrap.service.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { EVENT_PUBLISH } from "../../domain/ports/eventPublish.port.js";
import { PubSubRepository } from "../pub-sub/pubSub.repository.js";
import { RedisModule } from "../redis/redis.module.js";

@Module({
    providers: [SchedulerService, SchedulerBootstrapService, {provide: EVENT_PUBLISH, useClass: PubSubRepository}],
    imports: [PrismaModule, RedisModule]
})

export class SchedulerModule { }