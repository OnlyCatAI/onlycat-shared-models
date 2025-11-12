export enum EventTriggerSource {
    Manual = 0,
    Remote = 1,
    IndoorMotion = 2,
    OutdoorMotion = 3
}

export enum EventClassification {
    Unknown = 0,
    Clear = 1,
    Suspicious = 2,
    Contraband = 3,
    HumanActivity = 4,
    RemoteUnlock = 10
}

export class DeviceEvent {
    globalId?: number;
    deviceId: string;
    eventId: number;
    timestamp: Date | null;
    frameCount: number | null;
    eventTriggerSource: EventTriggerSource | null;
    eventClassification: EventClassification | null;
    eventManualClassification: EventClassification | null;
    eventManualClassificationUserId: number | null;
    posterFrameIndex: number | null;
    accessToken: string | null;
    deletedAt: Date | null;
    rfidCodes?: string[];
    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<DeviceEvent> & Record<string, any>) {
        this.globalId = initObj.globalId;
        this.deviceId = initObj.deviceId!;
        this.eventId = initObj.eventId!;
        this.timestamp = initObj.timestamp!;
        this.frameCount = initObj.frameCount!;
        this.eventTriggerSource = initObj.eventTriggerSource!;
        this.eventClassification = initObj.eventClassification!;
        this.eventManualClassification = initObj.eventManualClassification!;
        this.eventManualClassificationUserId = initObj.eventManualClassificationUserId!;
        this.posterFrameIndex = initObj.posterFrameIndex!;
        this.accessToken = initObj.accessToken!;
        this.deletedAt = initObj.deletedAt || null;
        this.rfidCodes = initObj.rfidCodes;

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }

    get hasManualClassification() {
        return this.eventManualClassification !== undefined && this.eventManualClassification !== null;
    }

    get eventEffectiveClassification() {
        return this.hasManualClassification ? this.eventManualClassification : this.eventClassification;
    }
}
