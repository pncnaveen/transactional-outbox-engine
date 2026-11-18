import { Module } from "@nestjs/common";
import { ApplicationModule } from "./application/application.module.js";
import { RedisModule } from "./infrastructure/redis/redis.module.js";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { SchedulerModule } from "./infrastructure/scheduler/scheduler.module.js";


@Module({
    imports: [ApplicationModule, RedisModule, ConfigModule.forRoot(), ScheduleModule.forRoot(), SchedulerModule],
})

export class AppModule { }