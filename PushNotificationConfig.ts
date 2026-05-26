import type { SubEvent } from './EventSummary';

export const PushNotificationRuleKeys = {
    TRANSIT_INWARD: 'transit.inward',
    TRANSIT_OUTWARD: 'transit.outward',
    PEEK_INWARD: 'peek.inward',
    PEEK_OUTWARD: 'peek.outward',
    BREACH_INWARD: 'breach.inward',
    BREACH_OUTWARD: 'breach.outward',
    CONTRABAND: 'contraband'
} as const;

export type PushNotificationRuleKey =
    typeof PushNotificationRuleKeys[keyof typeof PushNotificationRuleKeys];

export const PushNotificationRuleValues = {
    OFF: 'off',
    ON: 'on',
    CRITICAL: 'critical'
} as const;

export type PushNotificationRuleValue =
    typeof PushNotificationRuleValues[keyof typeof PushNotificationRuleValues];

export interface PushNotificationQuietHours {
    enabled: boolean;
    timeRange: string;
    timezone: string;
    criticalBypasses: boolean;
}

export type PushNotificationRules = Record<PushNotificationRuleKey, PushNotificationRuleValue>;

export interface PushNotificationConfigJson {
    schemaVersion: 1;
    pushEnabled: boolean;
    rules: PushNotificationRules;
    quietHours: PushNotificationQuietHours;
    [key: string]: any;
}

export const DEFAULT_PUSH_NOTIFICATION_RULES: PushNotificationRules = {
    [PushNotificationRuleKeys.TRANSIT_INWARD]: PushNotificationRuleValues.ON,
    [PushNotificationRuleKeys.TRANSIT_OUTWARD]: PushNotificationRuleValues.ON,
    [PushNotificationRuleKeys.PEEK_INWARD]: PushNotificationRuleValues.ON,
    [PushNotificationRuleKeys.PEEK_OUTWARD]: PushNotificationRuleValues.OFF,
    [PushNotificationRuleKeys.BREACH_INWARD]: PushNotificationRuleValues.CRITICAL,
    [PushNotificationRuleKeys.BREACH_OUTWARD]: PushNotificationRuleValues.CRITICAL,
    [PushNotificationRuleKeys.CONTRABAND]: PushNotificationRuleValues.ON
};

export const DEFAULT_PUSH_NOTIFICATION_QUIET_HOURS: PushNotificationQuietHours = {
    enabled: false,
    timeRange: '22:00-07:00',
    timezone: 'Europe/London',
    criticalBypasses: true
};

export const DEFAULT_PUSH_NOTIFICATION_CONFIG: PushNotificationConfigJson = {
    schemaVersion: 1,
    pushEnabled: true,
    rules: DEFAULT_PUSH_NOTIFICATION_RULES,
    quietHours: DEFAULT_PUSH_NOTIFICATION_QUIET_HOURS
};

export class PushNotificationConfig implements PushNotificationConfigJson {
    appToken?: string;
    schemaVersion: 1;
    pushEnabled: boolean;
    rules: PushNotificationRules;
    quietHours: PushNotificationQuietHours;
    updatedAt?: Date | null;
    [key: string]: any;

    constructor(initObj: Partial<PushNotificationConfig> & Record<string, any>) {
        this.appToken = initObj.appToken;
        this.schemaVersion = 1;
        this.pushEnabled = initObj.pushEnabled ?? DEFAULT_PUSH_NOTIFICATION_CONFIG.pushEnabled;
        this.rules = {
            ...DEFAULT_PUSH_NOTIFICATION_RULES,
            ...(initObj.rules ?? {})
        };
        this.quietHours = {
            ...DEFAULT_PUSH_NOTIFICATION_QUIET_HOURS,
            ...(initObj.quietHours ?? {})
        };
        this.updatedAt = initObj.updatedAt ? new Date(initObj.updatedAt) : null;

        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }

    toConfigJson(): PushNotificationConfigJson {
        const { appToken, updatedAt, ...config } = this;
        return {
            ...config,
            schemaVersion: 1,
            pushEnabled: this.pushEnabled,
            rules: this.rules,
            quietHours: this.quietHours
        };
    }
}

export function getPushNotificationRuleKey(
    subevent: Pick<SubEvent, 'action' | 'direction'>
): PushNotificationRuleKey | null {
    switch (subevent.action) {
        case 'TRANSIT':
            return subevent.direction === 'INWARD'
                ? PushNotificationRuleKeys.TRANSIT_INWARD
                : PushNotificationRuleKeys.TRANSIT_OUTWARD;
        case 'PEEK':
            return subevent.direction === 'INWARD'
                ? PushNotificationRuleKeys.PEEK_INWARD
                : PushNotificationRuleKeys.PEEK_OUTWARD;
        case 'BREACH':
            return subevent.direction === 'INWARD'
                ? PushNotificationRuleKeys.BREACH_INWARD
                : PushNotificationRuleKeys.BREACH_OUTWARD;
        default:
            return null;
    }
}
