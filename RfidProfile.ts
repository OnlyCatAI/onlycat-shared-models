export const RFID_PROFILE_SEX_VALUES = ["MALE", "FEMALE"] as const;
export type RfidProfileSex = typeof RFID_PROFILE_SEX_VALUES[number];

export class RfidProfile {
    rfidCode: string;
    userId: number;
    /** The user's name for the cat; null on rows holding only other contributions (e.g. avatar only). */
    label: string | null;
    version: number;
    createdAt: Date;
    /** Pet date of birth (date-only, no time component), or null when not set. */
    dateOfBirth?: Date | null;
    /** Pet sex, or null when not set. */
    sex?: RfidProfileSex | null;
    /** Timestamp of the last avatar upload; null when the profile has no avatar. */
    avatarUpdatedAt?: Date | null;
    /**
     * Merged view only (RfidService.mergeRfidProfiles): the user whose row
     * holds the displayed avatar. Avatar URLs are /rfid-profiles/<avatarUserId>/<rfidCode>/avatar.
     */
    avatarUserId?: number | null;

    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<RfidProfile> & Record<string, any>) {
        this.rfidCode = initObj.rfidCode!;
        this.userId = initObj.userId!;
        this.label = initObj.label!;
        this.version = initObj.version!;
        this.createdAt = initObj.createdAt!;

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}
