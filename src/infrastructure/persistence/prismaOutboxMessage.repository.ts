import { ulid } from "ulid";
import { MessageStatus, EventType } from "../prisma/generated/enums.js";
import { OutboxMessageCreateInput } from "../prisma/generated/models.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { EventType as DomainEventType, OutboxMessage } from "../../domain/entities/outboxMessage.entity.js";
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

    async findAllByEventType(eventType: DomainEventType): Promise<OutboxMessage[]> {

        try {
            const outboxMessages: OutboxMessage[] = [];
            const response = await this.prisma.outboxMessage.findMany({
                where: {
                    eventType: eventType as EventType
                },
                include: {
                    account: true
                }
            });
            response.forEach(outboxMessage => {
                outboxMessages.push({
                    id: outboxMessage.id,
                    eventType: outboxMessage.eventType as DomainEventType,
                    account: outboxMessage.account as User
                });
            });
            return outboxMessages;
        } catch (error) {
            throw error;
        }

    }
}