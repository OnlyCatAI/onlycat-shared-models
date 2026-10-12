export interface EventFeedbackInternalComment {
    id: number;
    feedbackId: number;
    userId: number;
    authorName: string;
    body: string;
    createdAt: string;
}
export interface EventFeedbackCommentsPage {
    comments: EventFeedbackInternalComment[];
    nextBeforeId?: number;
}
