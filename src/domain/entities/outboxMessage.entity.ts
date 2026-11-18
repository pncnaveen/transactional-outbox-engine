import { User } from "./user.entity.js";

export type OutboxMessage = {
    id: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    processedAt?: string | Date;
    failedAt?: string | Date;
    eventType: EventType;
    messsageStatus?: MessageStatus;
    retryCount?: number;
    errorMessage?: string;
    scheduledAt?: Date | string;
    account: User
}

export enum EventType {
    USER_CREATED = "USER_CREATED",
    ORDER_CREATED = "ORDER_CREATED"
}
export enum MessageStatus {
    RECEIVED = "RECEIVED",
    PROCESSING = "PROCESSING",
    PROCESSED = "PROCESSED",
    FAILED = "FAILED"
}
