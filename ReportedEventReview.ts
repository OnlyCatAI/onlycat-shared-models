import { FeedbackResolution } from "./EventUserFeedback";
export type ReportedEventReviewState = {
    assignedToUserId: number | null;
    assignmentVersion: number;
    feedbackResolution: FeedbackResolution;
    faultCategory: string | null;
    rootCauses: string[];
    faultVersion: number;
};
export type ReportedEventReviewChange =
    | { kind: "assignment"; assignedToUserId: number | null }
    | { kind: "resolution"; feedbackResolution: FeedbackResolution; contactReason?: string }
    | { kind: "faults"; faultCategory: string | null; rootCauses: string[] }
    | { kind: "undo"; restore: ReportedEventReviewState; contactEntryId?: string };
