import { EventType, MessageStatus, OutboxMessage } from "../entities/outboxMessage.entity.js";

export interface OutboxMessagesRepositoryPort {
    save(outboxMessage: OutboxMessage): Promise<boolean>;
    updateMessageStatus(eventType: EventType, queryMessageStatus: MessageStatus, updateMessageStatus: MessageStatus): Promise<OutboxMessage[]>;
    updateMessageStatusById(eventId: string, updateMessageStatus: MessageStatus): Promise<boolean>;
}

export const OUTBOX_MESSAGES_REPOSITORY = "OUTBOX_MESSAGES_REPOSITORY";