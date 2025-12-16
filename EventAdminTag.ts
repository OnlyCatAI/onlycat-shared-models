export interface EventAdminTag {
    deviceId: string;
    eventId: number;
    tag: string;
    taggedByUserId: number | null;
    taggedAt: Date;
}

