/**
 * Display-safe projection of a user for attribution UI ("started by",
 * "labelled by") and profile chips. Shared by the gateway, admin panel and
 * app; safe for any consumer the requester is allowed to see at all --
 * deliberately excludes sub, userLevel and description.
 */
export interface UserSummary {
    id: number;
    name: string | null;
    email: string | null;
    avatarUrl: string | null;
}
