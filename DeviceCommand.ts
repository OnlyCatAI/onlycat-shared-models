export class DeviceCommand {
    commandArn: string;
    commandId: string;
    displayName?: string;
    deprecated?: boolean;
    createdAt?: string;
    lastUpdatedAt?: string;
    pendingDeletion?: boolean;
    [key: string]: any;

    constructor(initObj: Partial<DeviceCommand> & Pick<DeviceCommand, "commandArn" | "commandId"> & Record<string, any>) {
        this.commandArn = initObj.commandArn;
        this.commandId = initObj.commandId;
        this.displayName = initObj.displayName;
        this.deprecated = initObj.deprecated;
        this.createdAt = initObj.createdAt;
        this.lastUpdatedAt = initObj.lastUpdatedAt;
        this.pendingDeletion = initObj.pendingDeletion;

        for (const key of Object.keys(initObj)) {
            if (!(key in this)) {
                this[key] = initObj[key];
            }
        }
    }
}

export interface DeviceCommandList {
    commands: DeviceCommand[];
    nextToken?: string;
}
