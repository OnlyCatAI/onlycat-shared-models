export type DeviceCommandExecutionUpdateType = "create" | "update";

export interface DeviceCommandExecutionStatusReason {
    reasonCode?: string;
    reasonDescription?: string;
}

export class DeviceCommandExecution {
    executionId: string;
    commandArn: string;
    commandId: string;
    targetArn: string;
    deviceId: string;
    status: string;
    statusReason?: DeviceCommandExecutionStatusReason;
    result?: Record<string, any>;
    parameters?: Record<string, any>;
    executionTimeoutSeconds?: number;
    createdAt?: string;
    lastUpdatedAt?: string;
    startedAt?: string;
    completedAt?: string;
    timeToLive?: string;
    timestamp?: number;

    [key: string]: any;

    constructor(initObj: Partial<DeviceCommandExecution> & Pick<
        DeviceCommandExecution,
        "executionId" | "commandArn" | "commandId" | "targetArn" | "deviceId" | "status"
    > & Record<string, any>) {
        this.executionId = initObj.executionId;
        this.commandArn = initObj.commandArn;
        this.commandId = initObj.commandId;
        this.targetArn = initObj.targetArn;
        this.deviceId = initObj.deviceId;
        this.status = initObj.status;
        this.statusReason = initObj.statusReason;
        this.result = initObj.result;
        this.parameters = initObj.parameters;
        this.executionTimeoutSeconds = initObj.executionTimeoutSeconds;
        this.createdAt = initObj.createdAt;
        this.lastUpdatedAt = initObj.lastUpdatedAt;
        this.startedAt = initObj.startedAt;
        this.completedAt = initObj.completedAt;
        this.timeToLive = initObj.timeToLive;
        this.timestamp = initObj.timestamp;

        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}

export interface DeviceCommandExecutionList {
    commandExecutions: DeviceCommandExecution[];
    nextToken?: string;
}

export interface DeviceCommandExecutionUpdate {
    type: DeviceCommandExecutionUpdateType;
    deviceId: string;
    executionId: string;
    commandId: string;
    commandArn: string;
    targetArn: string;
    body: Partial<DeviceCommandExecution>;
}
