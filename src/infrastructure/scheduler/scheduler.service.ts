import { Injectable } from "@nestjs/common";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";


@Injectable()
export class SchedulerService {

    constructor(private readonly schedulerRegistry: SchedulerRegistry) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        console.log("cron job running for every 1 seconds");

        //    const jobs =  this.schedulerRegistry.getCronJobs();
        //    jobs.forEach(job => {
        //     job.na
        //    });
    }

    createScheduler(name: string, cronExpression: CronExpression, jobFunction: () => void): void {
        // const cronExpression = CronExpression.EVERY_5_SECONDS.toString();
        const job = new CronJob(cronExpression.toString(), jobFunction);
        this.schedulerRegistry.addCronJob(name, job);
        job.start();
    }
}