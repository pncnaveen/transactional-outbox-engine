import { EventType, OutboxMessage } from "../entities/outboxMessage.entity.js";

export interface OutboxMessagesRepositoryPort {
    save(outboxMessage: OutboxMessage): Promise<boolean>;
    findAllByEventType(eventType: EventType): Promise<OutboxMessage[]>;
}

export const OUTBOX_MESSAGES_REPOSITORY = "OUTBOX_MESSAGES_REPOSITORY";