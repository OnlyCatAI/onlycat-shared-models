export class EventAdminTag {
    id?: number;
    deviceId: string;
    eventId: number;
    tag: string;
    taggedByUserId: number | null;
    taggedAt: Date;
    [key: string]: any;

    constructor(initObj: Partial<EventAdminTag> & Record<string, any>) {
        this.id = initObj.id;
        this.deviceId = initObj.deviceId!;
        this.eventId = initObj.eventId!;
        this.tag = initObj.tag!;
        this.taggedByUserId = initObj.taggedByUserId ?? null;
        this.taggedAt = initObj.taggedAt ? new Date(initObj.taggedAt) : new Date();

        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}
