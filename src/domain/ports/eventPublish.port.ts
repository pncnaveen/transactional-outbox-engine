export interface EventPublishPort {
    publishEvent(channel: string, event: any): Promise<void>;
}

export const EVENT_PUBLISH = Symbol("EVENT_PUBLISH");