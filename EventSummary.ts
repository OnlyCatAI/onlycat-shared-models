export type SubEventDirection = "INWARD" | "OUTWARD";
export type SubEventAction = "PEEK" | "TRANSIT" | "DENY" | "BREACH";
export type RfidCodeSubstitutionKey = `$${number}`;

export interface SubEvent {
    startFrameIndex: number;
    endFrameIndex: number;
    rfidCode: string | null;
    direction: SubEventDirection;
    action: SubEventAction;
}

export class EventSummary {
    static readonly missingRfidCodeKey = "none";
    private static readonly rfidCodeKeyPattern = /^\$(\d+)$/;

    deviceId: string;
    eventId: number;
    processedFrameCount: number;
    subevents: SubEvent[];
    localisedDescription?: string | null;
    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<EventSummary> & Record<string, any>) {
        this.deviceId = initObj.deviceId!;
        this.eventId = initObj.eventId!;
        this.processedFrameCount = initObj.processedFrameCount ?? 0;
        this.subevents = (initObj.subevents ?? []).map((subevent) => ({
            startFrameIndex: Number(subevent.startFrameIndex),
            endFrameIndex: Number(subevent.endFrameIndex),
            rfidCode: subevent.rfidCode ?? null,
            direction: subevent.direction,
            action: subevent.action
        }));
        this.localisedDescription = initObj.localisedDescription ?? null;

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }

    static formatRfidCodeSubstitutionKey(index: number): RfidCodeSubstitutionKey {
        if (!Number.isInteger(index) || index < 1) {
            throw new Error(`RFID substitution key index must be a positive integer, got ${index}.`);
        }

        return `$${index}`;
    }

    static parseRfidCodeSubstitutionKey(key: string): number | null {
        const match = EventSummary.rfidCodeKeyPattern.exec(key.trim());
        if (!match) {
            return null;
        }

        return Number(match[1]);
    }

    get rfidCodes(): string[] {
        const uniqueRfidCodes = new Set<string>();

        for (const subevent of this.subevents) {
            if (subevent.rfidCode) {
                uniqueRfidCodes.add(subevent.rfidCode);
            }
        }

        return Array.from(uniqueRfidCodes);
    }

    get rfidCodeSubstitutionEntries(): Array<[RfidCodeSubstitutionKey, string]> {
        return this.rfidCodes.map((rfidCode, index) => [
            EventSummary.formatRfidCodeSubstitutionKey(index + 1),
            rfidCode
        ]);
    }

    get rfidCodeSubstitutionMap(): Record<string, RfidCodeSubstitutionKey> {
        return Object.fromEntries(
            this.rfidCodeSubstitutionEntries.map(([key, rfidCode]) => [rfidCode, key])
        );
    }

    getRfidCodeSubstitutionKey(rfidCode: string | null | undefined): RfidCodeSubstitutionKey | null {
        if (!rfidCode) {
            return null;
        }

        return this.rfidCodeSubstitutionMap[rfidCode] ?? null;
    }

    getRfidCodeFromSubstitutionKey(key: string | null | undefined): string | null {
        if (!key) {
            return null;
        }

        const index = EventSummary.parseRfidCodeSubstitutionKey(key);
        if (index === null) {
            return null;
        }

        return this.rfidCodes[index - 1] ?? null;
    }

    getSubeventKey(subevent: Pick<SubEvent, "rfidCode" | "action" | "direction">): string {
        const rfidCodeKey =
            this.getRfidCodeSubstitutionKey(subevent.rfidCode) ??
            EventSummary.missingRfidCodeKey;

        return [
            rfidCodeKey,
            subevent.action.toLowerCase(),
            subevent.direction.toLowerCase()
        ].join("-");
    }

    get summaryKey(): string {
        return this.subevents.map((subevent) => this.getSubeventKey(subevent)).join(",");
    }
}
