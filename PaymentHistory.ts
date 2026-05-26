export class PaymentHistory {
  idx?: number;
  deviceId: string;
  operation: string | null;
  operationTimestamp: Date | null;
  state: string | null;
  dateStart: Date | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  [key: string]: any; // Allow any additional properties

  constructor(initObj: Partial<PaymentHistory> & Record<string, any>) {
    this.idx = initObj.idx;
    this.deviceId = initObj.deviceId!;
    this.operation = initObj.operation || null;
    this.operationTimestamp = initObj.operationTimestamp
      ? new Date(initObj.operationTimestamp)
      : null;
    this.state = initObj.state || null;
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
