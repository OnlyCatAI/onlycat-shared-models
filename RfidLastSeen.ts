import { SubEvent } from "./EventSummary";

export type RfidLastSeenLocation = "INSIDE" | "OUTSIDE";
export type RfidLastSeenLocationSource = "EVENT" | "MANUAL";

export function getRfidLastSeenLocationFromSubevent(subevent: SubEvent | null | undefined): RfidLastSeenLocation | null {
    if (!subevent) {
        return null;
    }

    if (subevent.action === "TRANSIT" || subevent.action === "BREACH") {
        return subevent.direction === "INWARD" ? "INSIDE" : "OUTSIDE";
    }

    if (subevent.action === "PEEK" || subevent.action === "DENY") {
        return subevent.direction === "INWARD" ? "OUTSIDE" : "INSIDE";
    }

    return null;
}

export class RfidLastSeen {
    deviceId: string;
    rfidCode: string;
    eventId: number;
    eventTimestamp: Date | null;
    lastSubevent: SubEvent | null;
    location: RfidLastSeenLocation | null;
    locationSource: RfidLastSeenLocationSource;
    locationUpdatedAt: Date | null;
    locationUpdatedByUserId: number | null;
    updatedAt: Date | null;
    hiddenAt: Date | null;
    hiddenEventId: number | null;
    hiddenByUserId: number | null;

    [key: string]: any;

    constructor(initObj: Partial<RfidLastSeen> & Record<string, any>) {
        this.deviceId = initObj.deviceId!;
        this.rfidCode = initObj.rfidCode!;
        this.eventId = initObj.eventId!;
        this.eventTimestamp = initObj.eventTimestamp ? new Date(initObj.eventTimestamp) : null;
        this.lastSubevent = initObj.lastSubevent ? new SubEvent(initObj.lastSubevent) : null;
        this.location = initObj.location ?? getRfidLastSeenLocationFromSubevent(this.lastSubevent);
        this.locationSource = initObj.locationSource ?? "EVENT";
        this.updatedAt = new Date(initObj.updatedAt!);
        this.locationUpdatedAt = initObj.locationUpdatedAt
            ? new Date(initObj.locationUpdatedAt)
            : this.eventTimestamp ?? this.updatedAt;
        this.locationUpdatedByUserId = initObj.locationUpdatedByUserId ?? null;
        this.hiddenAt = initObj.hiddenAt ? new Date(initObj.hiddenAt) : null;
        this.hiddenEventId = initObj.hiddenEventId ?? null;
        this.hiddenByUserId = initObj.hiddenByUserId ?? null;

        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}
