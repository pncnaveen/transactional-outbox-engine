import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";
import { EventType, MessageStatus, OutboxMessage } from "../../domain/entities/outboxMessage.entity.js";
import { OUTBOX_MESSAGES_REPOSITORY, OutboxMessagesRepositoryPort } from "../../domain/ports/outboxMessages.repository.port.js";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private redisClient!: Redis;
    constructor(private readonly configService: ConfigService, 
        @Inject(OUTBOX_MESSAGES_REPOSITORY) private readonly outboxMessagesRepo: OutboxMessagesRepositoryPort) { }

    async onModuleInit(): Promise<void> {
        try {
            this.redisClient = new Redis({
                host: this.configService.get("REDIS_HOST"),
                port: this.configService.get("REDIS_PORT"),
                password: this.configService.get("REDIS_PASSWORD"),
                db: this.configService.get("REDIS_DB"),
                maxRetriesPerRequest: null
            })

            this.redisClient.on("connect", () => {
                console.log("Connected to Redis");
                this.sunscribeEvent();
            });

            this.redisClient.on("error", (error) => {
                console.error("Redis error:", error);
            });
        } catch (error) {
            throw new Error("Failed to connect to Redis");
        }
    }

    async onModuleDestroy(): Promise<void> {
        try {
            await this.redisClient.quit();
        } catch (error) {
            throw new Error("Failed to connect to Redis");
        }
    }

    async publishEvent(channel: string, event: any): Promise<void> {
        try {
            await this.redisClient.publish(channel, JSON.stringify(event));
        } catch (error) {
            throw new Error("Failed to publish event");
        }
    }

    async sunscribeEvent(): Promise<void> {
        try {
            const channels = [...Object.values(EventType)];
            channels.forEach(channel => {
                this.redisClient.subscribe(channel, (error, count) => {
                    if (error) {
                        console.error("Error subscribing to channel:", error);
                    } else {
                        console.log(`Subscribed to ${channel}. Total subscriptions: ${count}`);
                    }
                });
            });

            this.redisClient.on("message", (channel, message) => {
                const event = JSON.parse(message) as OutboxMessage;
                this.outboxMessagesRepo.updateMessageStatusById(event.id, MessageStatus.PROCESSED);
                console.log(`Received message on channel ${channel}: ${message}`);
            });
        } catch (error) {
            throw new Error("Failed to subscribe event");
        }
    }
}