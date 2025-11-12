import { EventClassification, DeviceEvent } from './DeviceEvent';

export interface DeviceEventsCriteria {
    beforeGlobalId?: number;
    eventClassification?: EventClassification;
    isStarred?: boolean;
    isContraband?: boolean;
}

export class DeviceEventsCriteriaHelper {
    /**
     * Check if an event matches the given criteria
     */
    static eventMatches(event: DeviceEvent, criteria?: DeviceEventsCriteria): boolean {
        if (!criteria) return true;
        
        // Check eventClassification if specified
        if (criteria.eventClassification !== undefined) {
            if (event.eventClassification !== criteria.eventClassification) {
                return false;
            }
        }
        
        // Add checks for other criteria properties as needed
        // This will automatically handle any future criteria properties
        for (const [key, value] of Object.entries(criteria)) {
            if (key === 'beforeGlobalId') continue; // Skip pagination parameter
            if (value !== undefined && event[key] !== value) {
                return false;
            }
        }
        
        return true;
    }
}