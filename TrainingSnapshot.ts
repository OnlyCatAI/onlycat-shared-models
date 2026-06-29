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

    constructor(initObj: Partial<TrainingSnapshot> & Record<string, any>) {
        super(initObj);

        this.label = initObj.label;
        this.cameraClarity = initObj.cameraClarity;
    }
}
