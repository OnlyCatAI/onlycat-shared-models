import { SubEvent } from "./EventSummary";

export class RfidLastSeen {
    deviceId: string;
    rfidCode: string;
    eventId: number;
    eventTimestamp: Date | null;
    lastSubevent: SubEvent | null;
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
        this.updatedAt = new Date(initObj.updatedAt!);
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
