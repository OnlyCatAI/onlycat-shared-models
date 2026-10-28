export enum WarrantyStatus {
    Active = "active",
    Replaced = "replaced",
    Void = "void"
}

export enum WarrantyStartSource {
    Activation = "activation",
    ShipCap = "ship_cap",
    Manual = "manual",
    Replacement = "replacement"
}

/**
 * What the customer is told. Worked out on read, never stored:
 * - covered:   in date, and any subscription plan is paid up
 * - expired:   past end_date
 * - suspended: in date, but the device's subscription has lapsed
 * - replaced:  the device was swapped for replacedByDeviceId, which carries the cover
 * - void:      voided by support (e.g. unauthorised opening)
 * - unknown:   no warranty row yet (not activated, or support must set it)
 */
export enum WarrantyCoverage {
    Covered = "covered",
    Expired = "expired",
    Suspended = "suspended",
    Replaced = "replaced",
    Void = "void",
    Unknown = "unknown"
}

export class DeviceWarranty {
    deviceId: string;
    status: WarrantyStatus;
    /** YYYY-MM-DD, inclusive */
    startDate: string;
    /** YYYY-MM-DD, inclusive: the last covered day */
    endDate: string;
    startSource: WarrantyStartSource;
    shippedAt: Date | null;
    activatedAt: Date | null;
    jiraFulfilmentKey: string | null;
    replacesDeviceId: string | null;
    replacedByDeviceId: string | null;
    jiraRepairKey: string | null;
    notes: string | null;
    changeUserId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<DeviceWarranty> & Record<string, any>) {
        this.deviceId = initObj.deviceId!;
        this.status = initObj.status ?? WarrantyStatus.Active;
        this.startDate = initObj.startDate!;
        this.endDate = initObj.endDate!;
        this.startSource = initObj.startSource!;
        this.shippedAt = initObj.shippedAt ? new Date(initObj.shippedAt) : null;
        this.activatedAt = initObj.activatedAt ? new Date(initObj.activatedAt) : null;
        this.jiraFulfilmentKey = initObj.jiraFulfilmentKey ?? null;
        this.replacesDeviceId = initObj.replacesDeviceId ?? null;
        this.replacedByDeviceId = initObj.replacedByDeviceId ?? null;
        this.jiraRepairKey = initObj.jiraRepairKey ?? null;
        this.notes = initObj.notes ?? null;
        this.changeUserId = initObj.changeUserId ?? null;
        this.createdAt = initObj.createdAt ? new Date(initObj.createdAt) : null;
        this.updatedAt = initObj.updatedAt ? new Date(initObj.updatedAt) : null;

        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}

/** The app's view of a device's warranty: the same coverage admin shows, without internal fields. */
export interface DeviceWarrantySummary {
    deviceId: string;
    coverage: WarrantyCoverage;
    startDate: string | null;
    endDate: string | null;
    /** Days of cover left including today; 0 once expired; null when unknown */
    daysRemaining: number | null;
    replacedByDeviceId: string | null;
}
