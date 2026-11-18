import { CronExpression } from "@nestjs/schedule";

export type SchedulerJobs = {
    name: string;
    cronExpression: CronExpression;
    jobFunction: () => void;
}