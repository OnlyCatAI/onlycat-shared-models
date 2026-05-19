export class StoreOrder {
  idx?: number;
  id: string | null;
  platform: string | null;
  status: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  [key: string]: any;

  constructor(initObj: Partial<StoreOrder> & Record<string, any>) {
    this.idx = initObj.idx;
    this.id =
      initObj.id ||
      initObj.orderId ||
      initObj.externalOrderId ||
      initObj.reference ||
      null;
    this.platform = initObj.platform || null;
    this.status = initObj.status || null;
    this.createdAt = initObj.createdAt
      ? new Date(initObj.createdAt)
      : initObj.dateCreated
        ? new Date(initObj.dateCreated)
        : null;
    this.updatedAt = initObj.updatedAt
      ? new Date(initObj.updatedAt)
      : initObj.dateUpdated
        ? new Date(initObj.dateUpdated)
        : null;

    for (const key in initObj) {
      if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
        this[key] = initObj[key];
      }
    }
  }
}
