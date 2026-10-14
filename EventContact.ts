export interface EventContactContext {
    available: boolean;
    reason?: string;
    email?: string;
    suggestedSubject?: string;
}
export interface EventContactResult {
    conversationUrl: string;
}
