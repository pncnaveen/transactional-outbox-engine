import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service.js";
import { SchedulerJobs } from "../../domain/entities/schedulerJobs.entity.js";
import { CronExpression } from "@nestjs/schedule";
import { OUTBOX_MESSAGES_REPOSITORY, OutboxMessagesRepositoryPort } from "../../domain/ports/outboxMessages.repository.port.js";
import { EventType } from "../../domain/entities/outboxMessage.entity.js";

@Injectable()
export class SchedulerBootstrapService implements OnModuleInit, OnModuleDestroy {
    constructor(private readonly schedulerService: SchedulerService,
        @Inject(OUTBOX_MESSAGES_REPOSITORY) private readonly outboxMessagesRepo: OutboxMessagesRepositoryPort) { }

    async onModuleInit() {
        console.log("should create all jobs");

        this.registerJobs();
    }
    async onModuleDestroy() {
        console.log("should destroy all jobs");

    }

    private registerJobs(): void {

        const jobs = this.getJobs();

        jobs.forEach(job => {
            this.schedulerService.createScheduler(job.name, job.cronExpression, job.jobFunction);
        });
    }

    getJobs(): Array<SchedulerJobs> {
        const jobs: SchedulerJobs[] = [
            {
                name: "user_created_job",
                cronExpression: CronExpression.EVERY_MINUTE,
                jobFunction: async () => {
                    try {
                        const outboxMessage = await this.outboxMessagesRepo.findAllByEventType(EventType.USER_CREATED);
                        if (outboxMessage.length > 0) {
                            outboxMessage.forEach(async (outboxMessage) => {
                                console.log(outboxMessage);
                            });
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        ]

        return jobs;
    }
}