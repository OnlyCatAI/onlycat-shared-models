import { EventClassification, DeviceEvent } from './DeviceEvent';

export interface DeviceEventCriteria {
    deviceId?: string;
    beforeGlobalId?: number;
    eventClassification?: EventClassification | EventClassification[];
    eventManualClassification?: EventClassification | EventClassification[] | null;
    rfidCode?: string | string[];
    isStarred?: boolean;
    isContraband?: boolean;
    sampling?: number;
}

export type UserDeviceEventCriteria = Omit<DeviceEventCriteria, 'deviceId' | 'eventManualClassification' | 'sampling'>;

export class DeviceEventCriteriaHelper {
    /**
     * Check if an event matches the given criteria
     */
    static eventMatches(event: DeviceEvent, criteria?: DeviceEventCriteria): boolean {
        if (!criteria) return true;
        
        // Check eventClassification if specified
        if (criteria.eventClassification !== undefined) {
            const classifications = Array.isArray(criteria.eventClassification)
                ? criteria.eventClassification
                : [criteria.eventClassification];
            if (!classifications.includes(event.eventClassification as EventClassification)) {
                return false;
            }
        }

        if (criteria.eventManualClassification === null) {
            if (event.eventManualClassification !== null) {
                return false;
            }
        } else if (criteria.eventManualClassification !== undefined) {
            const manualClassifications = Array.isArray(criteria.eventManualClassification)
                ? criteria.eventManualClassification
                : [criteria.eventManualClassification];
            if (!manualClassifications.includes(event.eventManualClassification as EventClassification)) {
                return false;
            }
        }

        if (criteria.sampling !== undefined && criteria.sampling > 1) {
            if (event.globalId === undefined || event.globalId % criteria.sampling !== 0) {
                return false;
            }
        }

        if (criteria.rfidCode !== undefined) {
            const requestedCodes = Array.isArray(criteria.rfidCode) ? criteria.rfidCode : [criteria.rfidCode];
            const eventRfidCodes = event.rfidCodes ?? [];

            if (!requestedCodes.some(rfidCode => eventRfidCodes.includes(rfidCode))) {
                return false;
            }
        }
        
        // Add checks for other criteria properties as needed
        // This will automatically handle any future criteria properties
        for (const [key, value] of Object.entries(criteria)) {
            if (key === 'beforeGlobalId' || key === 'eventClassification' || key === 'eventManualClassification' || key === 'rfidCode' || key === 'sampling') continue; // Skip pagination/filter helpers handled above
            if (value !== undefined && event[key] !== value) {
                return false;
            }
        }
        
        return true;
    }
}
