import { Module } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service.js";
import { SchedulerBootstrapService } from "./scheduler.bootstrap.service.js";
import { PrismaModule } from "../prisma/prisma.module.js";

@Module({
    providers: [SchedulerService, SchedulerBootstrapService],
    imports: [PrismaModule]
})

export class SchedulerModule { }