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

export class Device {
    deviceId: string;
    description: string | null;
    timeZone: string | null;
    firmwareChannel: string | null;
    deviceTransitPolicyId: number | null;
    connectivity?: DeviceConnectivity;
    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<Device> & Record<string, any>) {
        this.deviceId = initObj.deviceId!;
        this.description = initObj.description!;
        this.timeZone = initObj.timeZone!;
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

    get macId(): string {
        // Strip prefix of a device ID such as OC-010203040506 to get the MAC ID 010203040506
        const macIdHex: string = this.deviceId.replace(/^OC-/, '');

        // Format the hex string into a MAC ID (xx:xx:xx:xx:xx:xx)
        return macIdHex.match(/.{1,2}/g)!.join(':');
    }

    get humanHash(): string {
        const parts = {
            tone: [
                "Cool", "Warm", "Bright", "Dark", "Funny", "Silly", "Quick", "Swift", "Flash", "Magic",
                "Red", "Blue", "Green", "Navy",
                "Gold", "Amber", "Pearl", "Coral", "Ruby", "Opal", "Jade",
                "Slate", "Smoke", "Ash", "Snow", "Frost",
                "Ember", "Mist", "Dawn", "Dusk", "Star", "Sun", "Cloud",
                "Indigo", "Violet", "Peach", "Sepia",
                "Beige", "Brown", "Black", "White", "Grey",
                "Silver", "Steel", "Iron", "Copper", "Bronze", "Brass",
                "Teak", "Oak", "Pine", "Wood", "Cedar", "Palm",
                "Stone", "Sand", "Grass"
            ],

            cat: [
                "Cat", "Kitty", "Kitten", "Tom", "Luna", "Queen", "Tabby", "Moggy", "Feline", "Tortie", "Rex",
                "Tiger", "Lion", "Puma",
                "Purr", "Meow",
                "Paw", "Claw", "Tail", "Fur", "Fuzz", "Bean", "Whisk",
                "Hunt", "Pounce", "Sneak", "Leap",
                "Nap", "Doze", "Cub",
                "Calico", "Pixie", "Mitt", "Boots", "Fluff",
                "Mouse", "Bird"
            ],

            door: [
                "Door", "Gate", "Hatch", "Flap", "Port", "Arch", "Entry", "Exit", "Window",
                "Way", "Path", "Pass", "Gap", "Bridge", "Aisle", "Alley", "Ramp", "Hall", "Porch", "Lobby", "Nook",
                "Vent", "Duct", "Tube", "Chute", "Snug",
                "Lock", "Latch", "Bolt", "Catch", "Seal", "Ring", "Loop", "Stop", "Slot", "Slide", "Link", "Hinge", "Bar", "Sill", "Pane",
                "Frame", "Grate", "Screen", "Mesh"
            ]
        };

        // Simple hash function
        var funhash = function (s: string): number {
            for (var i = 0, h = 0xdeadbeef; i < s.length; i++)
                h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
            return (h ^ h >>> 16) >>> 0;
        };
        const hash = funhash(this.deviceId);

        // Use the hash to pick parts
        const tone = parts.tone[Math.abs(hash) % parts.tone.length];
        const cat = parts.cat[Math.abs(Math.floor(hash / parts.tone.length)) % parts.cat.length];
        const door = parts.door[Math.abs(Math.floor(hash / (parts.tone.length * parts.cat.length))) % parts.door.length];

        return `${tone} ${cat} ${door}`;
    }
}
