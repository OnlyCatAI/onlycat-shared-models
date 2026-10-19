export type OutreachContact = {
    id: string;
    reasons: Array<{ value: string | null; label: string }>;
    contactedAt: string;
    contactedByUserId: number;
};
export type CustomerOutreachContact = OutreachContact & { feedbackId: number; eventId: number };
