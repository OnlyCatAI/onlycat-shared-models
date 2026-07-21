export interface UserApiKeyInit extends Record<string, unknown> {
    id?: number;
    userId?: number;
    name?: string;
    keyPrefix?: string;
    createdAt?: Date | string;
    lastUsedAt?: Date | string | null;
}

export class UserApiKey {
    id: number;
    userId: number;
    name: string;
    keyPrefix: string;
    createdAt: Date;
    lastUsedAt: Date | null;

    [key: string]: unknown;

    constructor(initObj: UserApiKeyInit) {
        this.id = initObj.id!;
        this.userId = initObj.userId!;
        this.name = initObj.name!;
        this.keyPrefix = initObj.keyPrefix!;
        this.createdAt = new Date(initObj.createdAt!);
        this.lastUsedAt = initObj.lastUsedAt ? new Date(initObj.lastUsedAt) : null;

        for (const key in initObj) {
            if (
                Object.prototype.hasOwnProperty.call(initObj, key)
                && !Object.prototype.hasOwnProperty.call(this, key)
            ) {
                this[key] = initObj[key];
            }
        }
    }
}
