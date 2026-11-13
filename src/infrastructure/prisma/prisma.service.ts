import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "./generated/client.js"

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    async onModuleInit() {
        console.log("Connecting to database...");
        await this.$connect();
    }

    async onModuleDestroy() {
        console.log("Disconnecting from database...");
        await this.$disconnect();
    }
}