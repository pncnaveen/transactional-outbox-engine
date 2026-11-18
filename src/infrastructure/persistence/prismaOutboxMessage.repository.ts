import { ulid } from "ulid";
import { EventType } from "../prisma/generated/enums.js";
import { OutboxMessageCreateInput } from "../prisma/generated/models.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { EventType as DomainEventType, MessageStatus, OutboxMessage } from "../../domain/entities/outboxMessage.entity.js";
import { OutboxMessagesRepositoryPort } from "../../domain/ports/outboxMessages.repository.port.js";
import { Injectable } from "@nestjs/common";
import { User } from "../../domain/entities/user.entity.js";

@Injectable()
export class PrismaOutboxMessageRepository implements OutboxMessagesRepositoryPort {

    constructor(private readonly prisma: PrismaService) { }

    async save(outboxMessage: OutboxMessage): Promise<boolean> {
        try {
            const event: OutboxMessageCreateInput = {
                eventType: EventType.USER_CREATED,
                id: ulid(),
                messsageStatus: MessageStatus.PROCESSING,
                retryCount: 0,
                account: {
                    connect: {
                        id: outboxMessage.account.id,
                    }
                }
            }
            const response = await this.prisma.outboxMessage.create({
                data: event
            });
            console.log(response);

            return true;
        } catch (error) {
            throw error;
        }
    }

    async updateMessageStatus(eventType: DomainEventType, queryMessageStatus: MessageStatus, updateMessageStatus: MessageStatus): Promise<OutboxMessage[]> {
        try {
            const outboxMessages: OutboxMessage[] = [];

            await this.prisma.$transaction(async (tx) => {
                const response = await tx.$queryRaw<OutboxMessage[]>`SELECT id, event_type as "eventType" FROM outbox_messages 
                WHERE "messsage_status" = ${queryMessageStatus.toString()} :: "MessageStatus" AND "event_type" = ${eventType.toString()} :: "EventType"
                ORDER BY created_at ASC 
                LIMIT 50 
                FOR UPDATE SKIP LOCKED`;

                if (response.length == 0) {
                    return outboxMessages;
                }
                response.forEach(outboxMessage => {
                    outboxMessages.push({
                        id: outboxMessage.id,
                        eventType: outboxMessage.eventType as DomainEventType,
                        account: outboxMessage.account as User
                    });
                });

                await tx.outboxMessage.updateMany({
                    where: {
                        id: {
                            in: outboxMessages.map(message => message.id)
                        }
                    },
                    data: {
                        messsageStatus: updateMessageStatus
                    }
                })
            });

            return outboxMessages;
        } catch (error) {
            throw error;
        }
    }

    async updateMessageStatusById(eventId: string, updateMessageStatus: MessageStatus): Promise<boolean> {
        try {
            const response = await this.prisma.outboxMessage.update({
                where: { id: eventId },
                data: { messsageStatus: updateMessageStatus }
            });
            return true;
        } catch (error) {
            throw error;
        }
    }
}