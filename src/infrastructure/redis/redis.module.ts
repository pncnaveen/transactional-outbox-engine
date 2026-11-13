import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service.js";
import { EVENT_PUBLISH } from "../../domain/ports/eventPublish.port.js";
import { PubSubRepository } from "../pub-sub/pubSub.repository.js";
import { ConfigModule } from "@nestjs/config";

@Module({
    providers: [RedisService, { provide: EVENT_PUBLISH, useClass: PubSubRepository }],
    exports: [RedisService, EVENT_PUBLISH],
    imports: [ConfigModule],
})
export class RedisModule { }