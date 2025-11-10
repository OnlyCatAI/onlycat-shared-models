import { FrameClassification } from "./FrameClassification";

export enum MotionSensorState {
    Unknown = 0,
    None = 1,
    Indoor = 2,
    Outdoor = 3
}

export enum LockState {
    Unknown = 0,
    Locked = 1,
    Unlocked = 2,
    LongTermUnlocked = 3
}

export enum FlapState {
    Unknown = -1,
    Closed = 0,
    OpenInward = 1,
    OpenOutward = 2,
    Invalid = 3
}

export enum EventClassification {
    Unknown = 0,
    Clear = 1,
    Suspicious = 2,
    Contraband = 3,
    HumanActivity = 4,
    RemoteUnlock = 10
}

export enum RfidReadStatus
{
    Inactive = -1,
    None = 0,
    Valid,
    Invalid,
    Recovered
}

export class FrameMetadata {
    motionSensorState: MotionSensorState;
    lockState: LockState;
    flapState: FlapState;
    targetLockState: LockState;
    eventClassification: EventClassification;
    eventClassificationChanged: boolean;
    frameClassification: FrameClassification;
    timestamp?: Date;
    rfidReadStatus?: RfidReadStatus;
    rfidReadOutdoor?: boolean;
    rfidReadCode? : string;
    rfidReadAge? : number;
    rfidResonanceRampTime?: number;
    rfidResonanceRampVoltage?: number;
    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<FrameMetadata> & Record<string, any>) {
        this.motionSensorState = Number(initObj.motionSensorState ?? MotionSensorState.Unknown);
        this.lockState = Number(initObj.lockState ?? LockState.Unknown);
        this.flapState = Number(initObj.flapState ?? FlapState.Unknown);
        this.targetLockState = Number(initObj.targetLockState ?? LockState.Unknown);
        this.eventClassification = Number(initObj.eventClassification ?? EventClassification.Unknown);
        this.eventClassificationChanged = Boolean(initObj.eventClassificationChanged);
        this.frameClassification = new FrameClassification(initObj.frameClassificationHex);
        this.rfidReadStatus = Number(initObj.rfidReadStatus ?? RfidReadStatus.Inactive);
        this.rfidReadOutdoor = Boolean(Number(initObj.rfidReadOutdoor));
        this.rfidReadCode = initObj.rfidReadCode;
        this.rfidReadAge = initObj.rfidReadAge;
        this.rfidResonanceRampTime = Number(initObj.rfidResonanceRampTime);
        this.rfidResonanceRampVoltage = Number(initObj.rfidResonanceRampVoltage);

        if (initObj.timestamp) {
            this.timestamp = new Date(Number(initObj.timestamp) * 1000);
        }

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}
