/**
 * A single device reboot, as reported by the firmware on connect.
 *
 * Published by `IOTTelemetry::publishRebootReason` (onlycat-firmware:
 * `onlycat-comms/src/comms/iot/services/iot_telemetry.cpp`) and stored in
 * `device_reboot_log`. One object per reboot — the legacy Timestream layout
 * returned one row per *field*, which is what `DeviceErrorLog` still models.
 */

/**
 * Values seen in the field so far. Kept open as a string union rather than a
 * closed enum: `cause` comes straight from firmware, so a new build can add one
 * at any time and the gateway must not start dropping reboots when it does.
 */
export type DeviceRebootCause =
    | "WATCHDOG"
    | "REQUESTED"
    | "UNKNOWN"
    | "EXCEPTION"
    | "STACK_OVERFLOW"
    | (string & {});

export class DeviceRebootLog {
    deviceId: string;
    /** When the reboot record reached the platform, not when the device rebooted. */
    timestamp: Date;
    /**
     * Firmware build that crashed. Null before 2026-07-14, when firmware began
     * reporting it.
     */
    build: number | null;
    /** Null before 2026-03-21, when firmware began reporting structured fields. */
    cause: DeviceRebootCause | null;
    /**
     * Null means the device did not report it — not "this was not an error".
     * Only populated from 2026-03-21 onwards.
     */
    isError: boolean | null;
    /** Short human-readable cause, e.g. "Camera connection watchdog". */
    summary: string | null;
    /** Extra diagnostic detail, e.g. "task=ipc pc=0x5811d742". Usually absent. */
    detail: string | null;
    /**
     * The firmware's own rendering, stored verbatim. Its format has changed
     * across builds, so it is preserved rather than recomposed from the fields
     * above — reconstructing it would silently rewrite history. This is the only
     * field present for the whole history back to 2024-05-03.
     */
    message: string | null;

    [key: string]: any;

    constructor(initObj: Partial<DeviceRebootLog> & Record<string, any>) {
        this.deviceId = initObj.deviceId!;
        this.timestamp = new Date(initObj.timestamp!);
        this.build = initObj.build ?? null;
        this.cause = initObj.cause ?? null;
        this.isError = initObj.isError ?? null;
        this.summary = initObj.summary ?? null;
        this.detail = initObj.detail ?? null;
        this.message = initObj.message ?? null;

        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}
