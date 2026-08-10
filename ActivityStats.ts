/**
 * Daily activity stats, read from the event_rollup_daily_rfid /
 * event_rollup_daily_device rollup tables maintained by the onlycat-stats
 * worker (gateway migration 20260804_01_event_stats_rollups.sql).
 *
 * All days are DEVICE-local calendar days ('YYYY-MM-DD' on the device's
 * own clock, device.time_zone); the gateway returns a timeZones map
 * alongside these so consumers can label them honestly. Days with no
 * activity have no row: streak or average computations must treat missing
 * days as zeros, not skip them.
 */

/** rfidCode bucket for subevents without a valid chip read. */
export const UNIDENTIFIED_RFID_CODE = "none";

/** One rollup row: one chip on one device on one local day. */
export interface RfidDailyStats {
    dayLocal: string;
    deviceId: string;
    rfidCode: string;
    transitsIn: number;
    transitsOut: number;
    peeks: number;
    denies: number;
    breaches: number;
    /**
     * Contraband events attributed to every chip read during the event.
     * Event grain: device-level prey totals come from DeviceDailyStats,
     * not a sum over chips.
     */
    preyAttempts: number;
    /** 24 transit counts (in + out) by device-local hour. */
    hourHistogram: number[];
    /** Device-local minute-of-day of the first outward transit, if any. */
    firstExitMinute: number | null;
    /** Device-local minute-of-day of the last inward transit, if any. */
    lastEntryMinute: number | null;
}

/** Event-grain device totals for one local day. */
export interface DeviceDailyStats {
    dayLocal: string;
    deviceId: string;
    totalEvents: number;
    preyAttempts: number;
    humanActivityEvents: number;
    remoteUnlocks: number;
    manualUnlocks: number;
    unidentifiedTransits: number;
}

/** RfidDailyStats summed across devices and chips for one local day. */
export interface DailyActivityAggregate {
    dayLocal: string;
    transitsIn: number;
    transitsOut: number;
    peeks: number;
    denies: number;
    breaches: number;
    preyAttempts: number;
    hourHistogram: number[];
    firstExitMinute: number | null;
    lastEntryMinute: number | null;
}

/**
 * RfidDailyStats summed across devices and chips per device-local calendar
 * month ('YYYY-MM'). No first/last-exit minutes here: those are day-shaped
 * stats, and for night-active cats the local-midnight boundary makes their
 * monthly averages misleading. Months with low activeDays should be shown
 * as "no data" rather than zero - an offline device looks identical to a
 * lazy cat otherwise.
 */
export interface MonthlyActivityAggregate {
    monthLocal: string;
    transitsIn: number;
    transitsOut: number;
    peeks: number;
    denies: number;
    breaches: number;
    preyAttempts: number;
    hourHistogram: number[];
    /** Distinct local days in the month with at least one rollup row. */
    activeDays: number;
}

/** RfidDailyStats summed per chip across a day range (leaderboards). */
export interface CatActivityAggregate {
    rfidCode: string;
    transitsIn: number;
    transitsOut: number;
    peeks: number;
    denies: number;
    breaches: number;
    preyAttempts: number;
    hourHistogram: number[];
    /** Distinct local days with at least one rollup row for this chip. */
    activeDays: number;
}

export interface ActivityStatsCriteria {
    /** Inclusive 'YYYY-MM-DD' device-local day bounds. */
    fromDay: string;
    toDay: string;
    rfidCode?: string;
    /** Include chips the household has hidden (e.g. neighbour cats). */
    includeHidden?: boolean;
}
