export interface DeviceConnectivity {
    connected?: boolean;
    /**
     * The epoch time (in milliseconds) when the device last connected or disconnected.
     * If the device has been disconnected for approximately an hour, the time value might be missing.
     */
    timestamp?: number;
    /**
     * The reason why the device is disconnected.
     * If the device has been disconnected for approximately an hour, the disconnectReason< value might be missing.
     */
    disconnectReason?: string;
}

/*
 * A device ID is `<product code>-<MAC>`: two letters naming the product, then
 * the 12 hex digits of the device's Wi-Fi MAC address, e.g. OC-8C1F64481234.
 * The product code follows from the MAC, because each block of addresses is
 * allocated to one product; an address in no block is an OC device.
 */
const DEFAULT_PRODUCT_CODE = "OC";

/** Allocated MAC blocks, most specific first: an address belongs to the first block it starts with. */
const MAC_BLOCKS: ReadonlyArray<{ readonly prefix: string; readonly productCode: string }> = [
    { prefix: "0CBFB4900", productCode: "OM" },
    { prefix: "8C1F64481", productCode: "OC" },
    { prefix: "0CBFB490", productCode: "OC" }
].sort((a, b) => b.prefix.length - a.prefix.length);

const PRODUCT_CODES: ReadonlySet<string> = new Set([DEFAULT_PRODUCT_CODE, ...MAC_BLOCKS.map((block) => block.productCode)]);

const DEVICE_ID_PATTERN = /^([A-Z]{2})-([0-9A-F]{12})$/;

export class Device {
    deviceId: string;
    description: string | null;
    timeZone: string | null;
    /**
     * Server-rendered idle screen template id ('5a', ...) or null to fall
     * back to the fleet default (which may itself be "no screen").
     * Consumed only by the render service - deliberately NOT in the shadow.
     */
    screenTemplate: string | null;
    /**
     * BCP 47 locale for what the device displays (server-rendered screens
     * and, soon, on-device UX). Mirrored to the shadow like timeZone.
     */
    locale: string | null;
    firmwareChannel: string | null;
    deviceTransitPolicyId: number | null;
    connectivity?: DeviceConnectivity;
    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<Device> & Record<string, any>) {
        this.deviceId = initObj.deviceId!;
        this.description = initObj.description!;
        this.timeZone = initObj.timeZone!;
        this.screenTemplate = initObj.screenTemplate ?? null;
        this.locale = initObj.locale ?? null;
        this.firmwareChannel = initObj.firmwareChannel!;
        this.deviceTransitPolicyId = initObj.deviceTransitPolicyId!;
        this.connectivity = initObj.connectivity!;

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }

    /**
     * The 12 hex digits of a MAC, from a device ID, a MAC with or without
     * colons, or a short ID: the last 4 or more digits of a MAC, completed from
     * the most specific allocated block that fixes every missing digit
     * (1234 -> 8C1F64481234). Anything else is returned cleaned up but as is.
     */
    static expandMacId(macIdOrDeviceId: string): string {
        const macId = macIdOrDeviceId.trim().toUpperCase().replace(/^[A-Z]{2}-/, "").replace(/:/g, "");

        if (/^[0-9A-F]{4,11}$/.test(macId)) {
            const missing = 12 - macId.length;
            const block = MAC_BLOCKS.find(
                ({ prefix }) => prefix.length >= missing && `${prefix.slice(0, missing)}${macId}`.startsWith(prefix)
            );
            if (block) {
                return `${block.prefix.slice(0, missing)}${macId}`;
            }
        }

        return macId;
    }

    /**
     * The product code of a device: the prefix of a device ID as given, or
     * else that of the MAC block the address is allocated from.
     */
    static productCodeOf(macIdOrDeviceId: string): string {
        const given = /^([A-Z]{2})-/.exec(macIdOrDeviceId.trim().toUpperCase());
        if (given) {
            return given[1];
        }
        const macId = Device.expandMacId(macIdOrDeviceId);
        return MAC_BLOCKS.find(({ prefix }) => macId.startsWith(prefix))?.productCode ?? DEFAULT_PRODUCT_CODE;
    }

    /** The device ID for any form of device ID, MAC or short ID (see expandMacId). */
    static toDeviceId(macIdOrDeviceId: string): string {
        return `${Device.productCodeOf(macIdOrDeviceId)}-${Device.expandMacId(macIdOrDeviceId)}`;
    }

    /** Whether this is a well-formed device ID of a known product. */
    static isDeviceId(deviceId: string): boolean {
        const match = DEVICE_ID_PATTERN.exec(deviceId);
        return match !== null && PRODUCT_CODES.has(match[1]);
    }

    get productCode(): string {
        return Device.productCodeOf(this.deviceId);
    }

    get macId(): string {
        // Strip the product code of a device ID such as OC-010203040506 to get the MAC ID 010203040506
        const macIdHex: string = Device.expandMacId(this.deviceId);

        // Format the hex string into a MAC ID (xx:xx:xx:xx:xx:xx)
        return macIdHex.match(/.{1,2}/g)!.join(":");
    }

    get humanHash(): string {
        const parts = {
            tone: [
                "Cool",
                "Warm",
                "Bright",
                "Dark",
                "Funny",
                "Silly",
                "Quick",
                "Swift",
                "Flash",
                "Magic",
                "Red",
                "Blue",
                "Green",
                "Navy",
                "Gold",
                "Amber",
                "Pearl",
                "Coral",
                "Ruby",
                "Opal",
                "Jade",
                "Slate",
                "Smoke",
                "Ash",
                "Snow",
                "Frost",
                "Ember",
                "Mist",
                "Dawn",
                "Dusk",
                "Star",
                "Sun",
                "Cloud",
                "Indigo",
                "Violet",
                "Peach",
                "Sepia",
                "Beige",
                "Brown",
                "Black",
                "White",
                "Grey",
                "Silver",
                "Steel",
                "Iron",
                "Copper",
                "Bronze",
                "Brass",
                "Teak",
                "Oak",
                "Pine",
                "Wood",
                "Cedar",
                "Palm",
                "Stone",
                "Sand",
                "Grass"
            ],

            cat: [
                "Cat",
                "Kitty",
                "Kitten",
                "Tom",
                "Luna",
                "Queen",
                "Tabby",
                "Moggy",
                "Feline",
                "Tortie",
                "Rex",
                "Tiger",
                "Lion",
                "Puma",
                "Purr",
                "Meow",
                "Paw",
                "Claw",
                "Tail",
                "Fur",
                "Fuzz",
                "Bean",
                "Whisk",
                "Hunt",
                "Pounce",
                "Sneak",
                "Leap",
                "Nap",
                "Doze",
                "Cub",
                "Calico",
                "Pixie",
                "Mitt",
                "Boots",
                "Fluff",
                "Mouse",
                "Bird"
            ],

            door: [
                "Door",
                "Gate",
                "Hatch",
                "Flap",
                "Port",
                "Arch",
                "Entry",
                "Exit",
                "Window",
                "Way",
                "Path",
                "Pass",
                "Gap",
                "Bridge",
                "Aisle",
                "Alley",
                "Ramp",
                "Hall",
                "Porch",
                "Lobby",
                "Nook",
                "Vent",
                "Duct",
                "Tube",
                "Chute",
                "Snug",
                "Lock",
                "Latch",
                "Bolt",
                "Catch",
                "Seal",
                "Ring",
                "Loop",
                "Stop",
                "Slot",
                "Slide",
                "Link",
                "Hinge",
                "Bar",
                "Sill",
                "Pane",
                "Frame",
                "Grate",
                "Screen",
                "Mesh"
            ]
        };

        // Simple hash function
        var funhash = function (s: string): number {
            for (var i = 0, h = 0xdeadbeef; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
            return (h ^ (h >>> 16)) >>> 0;
        };

        // NB: Hyphen was missed in original implementation - keep for compatibility
        const hash = funhash(this.deviceId.replace("-", ""));

        // Use the hash to pick parts
        const tone = parts.tone[Math.abs(hash) % parts.tone.length];
        const cat = parts.cat[Math.abs(Math.floor(hash / parts.tone.length)) % parts.cat.length];
        const door =
            parts.door[Math.abs(Math.floor(hash / (parts.tone.length * parts.cat.length))) % parts.door.length];

        return `${tone} ${cat} ${door}`;
    }
}
