/**
 * One telemetry sample: everything a device reported in a single
 * `dt/<deviceId>/metrics` message, which firmware publishes every 15 minutes.
 *
 * Published by `IOTTelemetry` (onlycat-firmware:
 * `onlycat-comms/src/comms/iot/services/iot_telemetry.cpp`) and stored as one
 * row of `device_telemetry`. One object per sample — the legacy Timestream
 * layout returned one row per *measure*, which is what `DeviceTelemetryMetric`
 * (onlycat-services-shared) still models.
 */
export class DeviceTelemetrySample {
    deviceId: string;
    /** When the sample reached the platform (the IoT rule's clock), not the device's clock. */
    timestamp: Date;
    /**
     * Keyed by the firmware's own measure names (`vbat`, `free_storage`,
     * `camera_csi_error_frames`, ...), unchanged, so the same identifier runs
     * from firmware through the table's columns and Grafana to here.
     *
     * A measure the device did not report is absent, not null. Which measures
     * exist depends on the firmware build, so treat every key as optional.
     */
    measures: Record<string, number>;

    [key: string]: any;

    constructor(initObj: Partial<DeviceTelemetrySample> & Record<string, any>) {
        this.deviceId = initObj.deviceId!;
        this.timestamp = new Date(initObj.timestamp!);
        this.measures = { ...(initObj.measures ?? {}) };

        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}
