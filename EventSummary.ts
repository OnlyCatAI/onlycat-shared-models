export type SubEventDirection = "INWARD" | "OUTWARD";
export type SubEventAction = "PEEK" | "TRANSIT" | "DENY" | "BREACH";

export interface SubEvent {
    startFrameIndex: number;
    endFrameIndex: number;
    rfidCode: string | null;
    direction: SubEventDirection;
    action: SubEventAction;
}

export interface EventSummary {
    deviceId: string;
    eventId: number;
    processedFrameCount: number;
    subevents: SubEvent[];
}
