// Stable identifiers keep reporting independent of display labels.
export const faultCategories = [
    { value: "microchip_reading", label: "Microchip reading issue", causes: [
        { value: "metal", label: "Metal" },
        { value: "noisy_adaptor", label: "Noisy adaptor" },
        { value: "weak_microchip", label: "Weak microchip" }
    ] },
    { value: "contraband_let_in", label: "Contraband let in", causes: [
        { value: "incorrect_door_policy", label: "Incorrect door policy" },
        { value: "lock_issue", label: "Lock issue" },
        { value: "flap_open", label: "Flap open" },
        { value: "exit_contraband", label: "Exit contraband" }
    ] },
    { value: "locking_issue", label: "Locking issue", causes: [
        { value: "lock_stuck_upward", label: "Cat unable to enter / lock stuck upward" },
        { value: "contraband_entry", label: "Contraband entry" },
        { value: "lock_malfunction", label: "Other lock malfunction" },
        { value: "time_lockout", label: "Time-based lockout still active" }
    ] },
    { value: "door_policy", label: "Door policy issue", causes: [
        { value: "unrecognised_cat_allowed", label: "Unrecognised cat allowed entry" }
    ] },
    { value: "escape_artist", label: "Escape artist cat", causes: [] },
    { value: "incorrect_microchip", label: "Incorrect microchip reading", causes: [] },
    { value: "incorrect_timeline", label: "Incorrect timeline", causes: [] },
    { value: "scanning", label: "Scanning", causes: [] },
    { value: "false_alarm", label: "False alarm", causes: [
        { value: "clean_lens", label: "Clean lens" }
    ] }
];

export const faultRootCauses = faultCategories.flatMap(category => category.causes);
export function validFaultLabels(category: unknown, causes: unknown): boolean {
    if (!Array.isArray(causes) || causes.some(cause => typeof cause !== "string")) return false;
    if (category === null) return causes.length === 0;
    const definition = faultCategories.find(item => item.value === category);
    return (!!definition || isCustomFaultCategory(category)) && new Set(causes).size === causes.length &&
        causes.every(cause => isCustomFaultReason(cause) || definition?.causes.some(item => item.value === cause));
}

export function isCustomFaultReason(value: unknown): value is string {
    return typeof value === "string" && /^custom:[^\x00-\x1f\x7f]{1,80}$/.test(value) && value.slice(7).trim() === value.slice(7);
}
export function faultReasonLabel(value: string): string {
    return isCustomFaultReason(value) ? value.slice(7) : faultRootCauses.find(cause => cause.value === value)?.label ?? value;
}

export function isCustomFaultCategory(value: unknown): value is string {
    return isCustomFaultReason(value) && value.length <= 40;
}
export function faultCategoryLabel(value: string | null | undefined): string {
    const label = faultCategories.find(category => category.value === value)?.label;
    return isCustomFaultCategory(value) ? value.slice(7) : label ?? "Unlabelled";
}
