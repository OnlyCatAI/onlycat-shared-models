import { EventClassification, EventTriggerSource } from "./DeviceEvent";
import { FlapState, MotionSensorState } from "./FrameMetadata";

/** Day of week in the device's local time zone, matching C `tm_wday` and JS `Date.getDay()`. */
export enum DayOfWeek {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
}

export interface TransitPolicyRuleCriteria {
    eventTriggerSource?: EventTriggerSource | EventTriggerSource[];
    eventClassification?: EventClassification | EventClassification[];
    rfidCode?: string | string[];
    rfidTimeout?: number;
    timeRange?: string | string[];
    dayOfWeek?: DayOfWeek | DayOfWeek[];
    motionSensorState?: MotionSensorState | MotionSensorState[];
    flapState?: FlapState | FlapState[];
}

export interface TransitPolicyRuleAction {
    lock?: boolean;
    sound?: string;
    lockoutDuration?: number;
    final?: boolean;
}

export interface TransitPolicyUxOnActivate {
    sound?: string;
}

export interface TransitPolicyUx {
    onActivate?: TransitPolicyUxOnActivate;
}

export class TransitPolicyRule {
    criteria?: TransitPolicyRuleCriteria;
    action?: TransitPolicyRuleAction;
    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<TransitPolicy> & Record<string, any>) {
        this.criteria = initObj.criteria!;
        this.action = initObj.action!;

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}

export class TransitPolicy {
    rules: TransitPolicyRule[];
    idleLock: boolean;
    idleLockBattery: boolean;
    ux: TransitPolicyUx;
    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<TransitPolicy> & Record<string, any>) {
        this.rules = initObj.rules ?? [];
        this.idleLock = initObj.idleLock ?? true;
        this.idleLockBattery = initObj.idleLockBattery ?? this.idleLock;
        this.ux = {
            ...(initObj.ux ?? {}),
            onActivate: {
                ...(initObj.ux?.onActivate ?? {}),
                sound: initObj.ux?.onActivate?.sound ?? "coin"
            }
        };

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }

    toJSON(): Record<string, any> {
        return { ...this };
    }
}
