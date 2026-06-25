export class PaymentHistory {
    idx?: number;
    deviceId: string;
    operation: string | null;
    operationTimestamp: Date | null;
    state: string | null;
    dateStart: Date | null;
    stripeSubscriptionId: string | null;
    stripeCustomerId: string | null;
    notes: string | null;
    changeUserId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<PaymentHistory> & Record<string, any>) {
        this.idx = initObj.idx;
        this.deviceId = initObj.deviceId!;
        this.operation = initObj.operation || null;
        this.operationTimestamp = initObj.operationTimestamp ? new Date(initObj.operationTimestamp) : null;
        this.state = initObj.state || null;
        this.dateStart = initObj.dateStart ? new Date(initObj.dateStart) : null;
        this.stripeSubscriptionId = initObj.stripeSubscriptionId || null;
        this.stripeCustomerId = initObj.stripeCustomerId || null;
        this.notes = initObj.notes || null;
        this.changeUserId = initObj.changeUserId ?? null;
        this.createdAt = initObj.createdAt ? new Date(initObj.createdAt) : null;
        this.updatedAt = initObj.updatedAt ? new Date(initObj.updatedAt) : null;

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}
