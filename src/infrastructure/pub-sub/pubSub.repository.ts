import { Injectable } from "@nestjs/common";
import { EventPublishPort } from "../../domain/ports/eventPublish.port.js";
import { RedisService } from "../redis/redis.service.js";

@Injectable()
export class PubSubRepository implements EventPublishPort {
    constructor(private readonly redisService: RedisService){}

    async publishEvent(event: any): Promise<void> {
        try {
            await this.redisService.publishEvent(event);
        } catch (error) {
            throw new Error("Failed to publish event");
        }
    }
}