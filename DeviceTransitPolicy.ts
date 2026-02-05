import { TransitPolicy } from "./TransitPolicy";

export class DeviceTransitPolicy {
    deviceTransitPolicyId: number;
    deviceId: string;
    name: string | null;
    transitPolicy: TransitPolicy;
    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<DeviceTransitPolicy> & Record<string, any>) {
        this.deviceTransitPolicyId = initObj.deviceTransitPolicyId!;
        this.deviceId = initObj.deviceId!;
        this.name = initObj.name!;
        this.transitPolicy = initObj.transitPolicy instanceof TransitPolicy
            ? initObj.transitPolicy
            : new TransitPolicy(initObj.transitPolicy!);

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}
