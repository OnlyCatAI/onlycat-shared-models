import { FrameClassification } from "./FrameClassification";

export interface SnapshotCriteria {
    deviceId?: string;
    /** Restrict to snapshots whose highest-scoring edge class is one of these. */
    classificationLabel?: string | string[];
    /** Restrict to snapshots whose highest-scoring edge class is none of these. */
    excludeClassificationLabel?: string | string[];
    /** Inclusive lower bound on the edge NO_CAT score, 0..1. */
    minClassificationNoCat?: number;
    /** true: only scored snapshots; false: only snapshots still awaiting a backfill. */
    hasClassification?: boolean;
}

export class Snapshot {
    id?: number;
    deviceId: string;
    timestamp: Date;
    /** Edge classification vector as reported by the device at snapshot time. */
    frameClassification?: FrameClassification;
    /** Highest-scoring class of `frameClassification`, denormalised for indexed filtering. */
    classificationLabel?: string;

    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<Snapshot> & Record<string, any>) {
        this.id = initObj.id;
        this.deviceId = initObj.deviceId!;
        this.timestamp = new Date(initObj.timestamp!);
        this.frameClassification = initObj.frameClassification;
        this.classificationLabel = initObj.classificationLabel ?? initObj.frameClassification?.topLabel;

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }

    get unixtime() {
        return Math.floor(this.timestamp.getTime() / 1000);
    }
}
