import { Snapshot } from "./Snapshot";

export interface TrainingSnapshotCriteria {
    deviceId?: string;
    label?: string | null;
    cameraClarity?: number;
    hasCameraClarity?: boolean;
}

export class TrainingSnapshot extends Snapshot {
    label?: string;
    cameraClarity?: number;
    lastUpdated?: Date;
    lastUpdatedByUserId: number | null;

    constructor(initObj: Partial<TrainingSnapshot> & Record<string, any>) {
        super(initObj);

        this.label = initObj.label;
        this.cameraClarity = initObj.cameraClarity;
        this.lastUpdated = initObj.lastUpdated ? new Date(initObj.lastUpdated) : undefined;
        this.lastUpdatedByUserId = initObj.lastUpdatedByUserId ?? null;
    }
}
