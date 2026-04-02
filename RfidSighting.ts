import { SubEvent } from './EventSummary';

export class RfidSighting {
    rfidCode: string;
    timestamp: Date;
    eventId: number;
    deviceId: string;

    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<RfidSighting> & Record<string, any>) {
        this.rfidCode = initObj.rfidCode!;
        this.timestamp = initObj.timestamp!;
        this.eventId = initObj.eventId!;
        this.deviceId = initObj.deviceId!;

        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}

export class RfidSightingWithSubevent extends RfidSighting {
    lastSubevent: SubEvent | null;

    constructor(initObj: Partial<RfidSightingWithSubevent> & Record<string, any>) {
        super(initObj);

        this.lastSubevent = initObj.lastSubevent ? new SubEvent(initObj.lastSubevent) : null;

        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}
