export class RfidProfile {
    rfidCode: string;
    userId: number;
    label: string;
    version: number;
    createdAt: Date;

    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<RfidProfile> & Record<string, any>) {
        this.rfidCode = initObj.rfidCode!;
        this.userId = initObj.userId!;
        this.label = initObj.label!;
        this.version = initObj.version!;
        this.createdAt = initObj.createdAt!;

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}
