import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private redisClient!: Redis;
    constructor(private readonly configService: ConfigService) { }

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

    async publishEvent(event: any): Promise<void> {
        try {
            await this.redisClient.publish("event-channel", JSON.stringify(event));
        } catch (error) {
            throw new Error("Failed to publish event");
        }
    }

    async sunscribeEvent(): Promise<void> {
        try {
            this.redisClient.subscribe("event-channel", (error, count) => {
                if (error) {
                    console.error("Error subscribing to channel:", error);
                } else {
                    console.log(`Subscribed to channel. Total subscriptions: ${count}`);
                }
            });

            this.redisClient.on("message", (channel, message) => {
                console.log(`Received message on channel ${channel}: ${message}`);
            });
        } catch (error) {
            throw new Error("Failed to subscribe event");
        }
    }
}