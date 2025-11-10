export class RfidProfileSighting {
    rfidCode: string;
    timestamp: Date;
    eventId: number;
    deviceId: string;

    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<RfidProfileSighting> & Record<string, any>) {
        this.rfidCode = initObj.rfidCode!;
        this.timestamp = initObj.timestamp!;
        this.eventId = initObj.eventId!;
        this.deviceId = initObj.deviceId!;

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}