export interface EventPublishPort {
    publishEvent(event: any): Promise<void>;
}

export const EVENT_PUBLISH = Symbol("EVENT_PUBLISH");