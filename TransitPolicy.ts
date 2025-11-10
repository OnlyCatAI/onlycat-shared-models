import { EventClassification, EventTriggerSource } from "./DeviceEvent";

export interface TransitPolicyRuleCriteria
{
    eventTriggerSource?: EventTriggerSource | EventTriggerSource[];
    eventClassification?: EventClassification | EventClassification[];
    rfidCode?: string | string[];
    timeRange?: string | string[];
}

export interface TransitPolicyRuleAction
{
    lock?: boolean;
    sound?: string;
}

export class TransitPolicyRule
{
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
    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<TransitPolicy> & Record<string, any>) {
        this.rules = initObj.rules ?? [];
        this.idleLock = initObj.idleLock ?? true;
        this.idleLockBattery = initObj.idleLockBattery ?? this.idleLock;

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}
