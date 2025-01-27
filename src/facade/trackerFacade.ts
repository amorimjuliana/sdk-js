import {
    ExternalTrackingEvent as ExternalEvent,
    ExternalTrackingEventPayload as ExternalEventPayload,
    ExternalTrackingEventType as ExternalEventType,
} from '../trackingEvents';
import {formatCause} from '../error';
import {Tracker, EventListener} from '../tracker';
import {
    cartModified,
    cartViewed,
    checkoutStarted,
    eventOccurred,
    goalCompleted,
    interestShown,
    postViewed,
    orderPlaced,
    productViewed,
    userSignedUp,
} from '../schema';

const eventSchemas = {
    cartViewed,
    cartModified,
    checkoutStarted,
    orderPlaced,
    productViewed,
    userSignedUp,
    eventOccurred,
    interestShown,
    postViewed,
    goalCompleted,
};

function createEvent<T extends ExternalEventType>(type: T, payload: unknown): ExternalEvent<T> {
    if (typeof type !== 'string') {
        throw new Error('The event type must of type string.');
    }

    if (typeof payload !== 'object' || payload == null) {
        throw new Error('The event payload must of type object.');
    }

    const event: UnknownEvent<T> = {type: type, ...payload};

    validateEvent(event);

    return event;
}

type UnknownEvent<T extends ExternalEventType> = Pick<ExternalEvent<T>, 'type'>;

function validateEvent<T extends ExternalEventType>(event: UnknownEvent<T>): asserts event is ExternalEvent<T> {
    const {type, ...payload} = event;

    if (!(type in eventSchemas)) {
        throw new Error(`Unknown event type '${type}'.`);
    }

    try {
        eventSchemas[type].validate(payload);
    } catch (violation) {
        throw new Error(`Invalid event payload: ${formatCause(violation)}`);
    }
}

export class TrackerFacade {
    private readonly tracker: Tracker;

    public constructor(tracker: Tracker) {
        this.tracker = tracker;
    }

    public get flushed(): Promise<void> {
        return this.tracker.flushed;
    }

    public enable(): void {
        this.tracker.enable();
    }

    public disable(): void {
        this.tracker.disable();
    }

    public addListener(listener: EventListener): void {
        this.tracker.addListener(listener);
    }

    public removeListener(listener: EventListener): void {
        this.tracker.removeListener(listener);
    }

    public track<T extends ExternalEventType>(type: T, payload: ExternalEventPayload<T>): Promise<ExternalEvent<T>> {
        return this.tracker.track(createEvent(type, payload));
    }
}
