export class TimeZone {
    timeZone: string;
    countryCode?: string | null;
    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<TimeZone> & Record<string, any>) {
        this.timeZone = initObj.timeZone!;
        this.countryCode = initObj.countryCode!;

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}
