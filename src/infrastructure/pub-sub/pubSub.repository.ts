import { Injectable } from "@nestjs/common";
import { EventPublishPort } from "../../domain/ports/eventPublish.port.js";
import { RedisService } from "../redis/redis.service.js";

@Injectable()
export class PubSubRepository implements EventPublishPort {
    constructor(private readonly redisService: RedisService) { }

    async publishEvent(channel: string, event: any): Promise<void> {
        try {
            await this.redisService.publishEvent(channel, event);
        } catch (error) {
            throw new Error("Failed to publish event");
        }
    }
}