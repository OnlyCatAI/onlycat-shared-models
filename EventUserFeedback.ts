export enum FeedbackType {
    Confirmed = 'confirmed',
    FalseAlarm = 'false_alarm',
    MissedContraband = 'missed_contraband',
    OtherIssue = 'other_issue'
}

export enum FeedbackResolution {
    Unresolved = 'unresolved',
    TrainingAdded = 'training_added',
    OtherResolution = 'other_resolution',
    CustomerContacted = 'customer_contacted',
    NoAction = 'no_action'
}

export class EventUserFeedback {
    id?: number;
    deviceId: string;
    eventId: number;
    userId: number;
    feedbackType: FeedbackType;
    feedbackResolution?: FeedbackResolution;
    feedbackComment?: string | null;
    feedbackCommentTranslation?: string | null;
    createdAt?: Date;
    updatedAt?: Date | null;
    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<EventUserFeedback> & Record<string, any>) {
        this.id = initObj.id;
        this.deviceId = initObj.deviceId!;
        this.eventId = initObj.eventId!;
        this.userId = initObj.userId!;
        this.feedbackType = initObj.feedbackType!;
        this.feedbackResolution = initObj.feedbackResolution;
        this.feedbackComment = initObj.feedbackComment;
        this.feedbackCommentTranslation = initObj.feedbackCommentTranslation;
        this.createdAt = initObj.createdAt;
        this.updatedAt = initObj.updatedAt;

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}
