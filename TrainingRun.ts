export type TrainingRunStoredStatus =
    | "PENDING"
    | "LAUNCHING"
    | "RUNNING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED";

/**
 * INTERRUPTED is derived, never stored: an active run whose instance stopped
 * heartbeating (spot interruption, crash) reports nothing, so readers infer
 * it from last_heartbeat_at instead of relying on a sweeper process.
 */
export type TrainingRunStatus = TrainingRunStoredStatus | "INTERRUPTED";

export type TrainingRunPhase = "DATASET" | "FLOAT" | "QAT" | "EXPORT" | "EVALUATE" | "UPLOAD";

export interface TrainingRunCriteria {
    status?: TrainingRunStoredStatus;
    modelType?: string;
}

export interface TrainingRunConfig {
    epochs?: number;
    learningRate?: number;
    fineTuneLayers?: number;
    qatEpochs?: number;
    labelSmoothing?: number;
    /** MobileNetV2 width multiplier; changes every layer width, so warm starts cannot cross values. */
    alpha?: number;
    /** Warm-start from this completed run's model_qat_float.keras instead of ImageNet. */
    initFromRunId?: number;
    /** Also inherit the seed run's quantizer state, skipping the float phase. */
    resumeQat?: boolean;
    notes?: string;
}

export class TrainingRun {
    id: number;
    runName: string;
    modelType: string;
    status: TrainingRunStatus;
    phase: TrainingRunPhase | null;
    config: TrainingRunConfig;
    requestedByUserId: number | null;
    instanceId: string | null;
    instanceType: string | null;
    spot: boolean;
    epochsTotal: number | null;
    qatEpochsTotal: number | null;
    currentEpoch: number | null;
    bestValAccuracy: number | null;
    int8ValAccuracy: number | null;
    datasetImageCount: number | null;
    classCounts: Record<string, number> | null;
    errorMessage: string | null;
    s3Prefix: string | null;
    createdAt: Date;
    launchedAt: Date | null;
    startedAt: Date | null;
    completedAt: Date | null;
    /** Soft-deleted from the panel; un-archiving is a manual DB update. */
    archivedAt: Date | null;
    lastHeartbeatAt: Date | null;

    constructor(initObj: Partial<TrainingRun> & Record<string, any>) {
        this.id = initObj.id!;
        this.runName = initObj.runName!;
        this.modelType = initObj.modelType ?? "CLASSIFICATION";
        this.status = initObj.status ?? "PENDING";
        this.phase = initObj.phase ?? null;
        this.config = initObj.config ?? {};
        this.requestedByUserId = initObj.requestedByUserId ?? null;
        this.instanceId = initObj.instanceId ?? null;
        this.instanceType = initObj.instanceType ?? null;
        this.spot = initObj.spot ?? true;
        this.epochsTotal = initObj.epochsTotal ?? null;
        this.qatEpochsTotal = initObj.qatEpochsTotal ?? null;
        this.currentEpoch = initObj.currentEpoch ?? null;
        this.bestValAccuracy = initObj.bestValAccuracy ?? null;
        this.int8ValAccuracy = initObj.int8ValAccuracy ?? null;
        this.datasetImageCount = initObj.datasetImageCount ?? null;
        this.classCounts = initObj.classCounts ?? null;
        this.errorMessage = initObj.errorMessage ?? null;
        this.s3Prefix = initObj.s3Prefix ?? null;
        this.createdAt = initObj.createdAt ? new Date(initObj.createdAt) : new Date();
        this.launchedAt = initObj.launchedAt ? new Date(initObj.launchedAt) : null;
        this.startedAt = initObj.startedAt ? new Date(initObj.startedAt) : null;
        this.completedAt = initObj.completedAt ? new Date(initObj.completedAt) : null;
        this.archivedAt = initObj.archivedAt ? new Date(initObj.archivedAt) : null;
        this.lastHeartbeatAt = initObj.lastHeartbeatAt ? new Date(initObj.lastHeartbeatAt) : null;
    }
}

export type TrainingRunEpochPhase = "FLOAT" | "QAT";

export class TrainingRunEpoch {
    runId: number;
    phase: TrainingRunEpochPhase;
    epoch: number;
    accuracy: number | null;
    loss: number | null;
    valAccuracy: number | null;
    valLoss: number | null;
    learningRate: number | null;
    durationSeconds: number | null;
    createdAt: Date;

    constructor(initObj: Partial<TrainingRunEpoch> & Record<string, any>) {
        this.runId = initObj.runId!;
        this.phase = initObj.phase ?? "FLOAT";
        this.epoch = initObj.epoch ?? 0;
        this.accuracy = initObj.accuracy ?? null;
        this.loss = initObj.loss ?? null;
        this.valAccuracy = initObj.valAccuracy ?? null;
        this.valLoss = initObj.valLoss ?? null;
        this.learningRate = initObj.learningRate ?? null;
        this.durationSeconds = initObj.durationSeconds ?? null;
        this.createdAt = initObj.createdAt ? new Date(initObj.createdAt) : new Date();
    }
}

/**
 * Pushed as "trainingRunUpdate" to sockets subscribed via getTrainingRuns.
 * Over the wire the run/epoch are plain JSON (dates arrive as ISO strings).
 */
export interface TrainingRunUpdate {
    type: "run" | "epoch";
    runId: number;
    run: TrainingRun;
    epoch?: TrainingRunEpoch;
}

/** Per-class row of sklearn's classification_report inside evaluation.json. */
export interface EvaluationReportRow {
    precision: number;
    recall: number;
    "f1-score": number;
    support: number;
}

/**
 * A validation image the model got wrong, ranked by its confidence in the
 * wrong answer. The top of the list is where labelling errors hide.
 */
export type MisclassifiedExample = {
    label: string;
    predicted: string;
    confidence: number;
    deviceId: string;
} & ({ kind: "frame"; eventId: number; frameIndex: number } | { kind: "snapshot"; timestamp: number });

/** results/<run>/evaluation.json uploaded by the training instance. */
export interface TrainingRunEvaluation {
    model: string;
    manifest: string;
    created_at: string;
    image_count: number;
    missing_manifest_files: number;
    class_names: string[];
    accuracy: number;
    report: Record<string, EvaluationReportRow | number>;
    confusion_matrix: number[][];
    /** Present from 2026-08-07 onward; older runs lack it. */
    misclassified?: MisclassifiedExample[];
}
