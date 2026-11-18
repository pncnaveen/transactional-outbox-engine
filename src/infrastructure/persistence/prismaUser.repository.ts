import { Injectable } from "@nestjs/common";
import { User } from "../../domain/entities/user.entity.js";
import { UserRepositoryPort } from "../../domain/ports/user.repository.port.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { OutboxMessage } from "../../domain/entities/outboxMessage.entity.js";
import { OutboxMessageCreateInput } from "../prisma/generated/models.js";

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async save(user: User, outboxMessage: OutboxMessage): Promise<boolean> {
        try {
            const event: OutboxMessageCreateInput = {
                eventType: outboxMessage.eventType,
                id: outboxMessage.id,
                messsageStatus: outboxMessage.messsageStatus,
                retryCount: 0,
                account: {
                    connect: {
                        id: outboxMessage.account.id,
                    }
                }
            }

            await this.prisma.$transaction(async (tx) => {
                await tx.user.create({
                    data: user
                });

                await tx.outboxMessage.create({
                    data: event
                });
            });

            return true;
        } catch (error) {
            throw error;
        }
    }
}