export enum PaymentPlanState {
    Pending = 'pending',
    Required = 'required',
    Active = 'active',
    Lifetime = 'lifetime',
    Reviewing = 'reviewing',
    Invalid = 'invalid',
}

export class DevicePaymentPlan {
    idx?: number;
    deviceId: string;
    state: PaymentPlanState | null;
    dateStart: Date | null;
    stripeSubscriptionId: string | null;
    stripeCustomerId: string | null;
    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<DevicePaymentPlan> & Record<string, any>) {
        this.idx = initObj.idx;
        this.deviceId = initObj.deviceId!;
        this.state = initObj.state!;
        this.dateStart = initObj.dateStart ? new Date(initObj.dateStart) : null;
        this.stripeSubscriptionId = initObj.stripeSubscriptionId || null;
        this.stripeCustomerId = initObj.stripeCustomerId || null;

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}
