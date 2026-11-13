import { Module } from "@nestjs/common";
import { ApplicationModule } from "./application/application.module.js";
import { RedisModule } from "./infrastructure/redis/redis.module.js";
import { ConfigModule } from "@nestjs/config";


@Module({
    imports: [ApplicationModule, RedisModule, ConfigModule.forRoot()],
})

export class AppModule { }