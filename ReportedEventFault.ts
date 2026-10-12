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
    return !!definition && new Set(causes).size === causes.length &&
        causes.every(cause => definition.causes.some(item => item.value === cause));
}
