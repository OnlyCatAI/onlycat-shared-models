export class Snapshot {
    id?: number;
    deviceId: string;
    timestamp: Date;

    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<Snapshot> & Record<string, any>) {
        this.id = initObj.id;
        this.deviceId = initObj.deviceId!;
        this.timestamp = initObj.timestamp!;

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }

    get unixtime() {
        return Math.floor(this.timestamp.getTime() / 1000);
    }
}
