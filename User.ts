export class User {
    id: number;
    sub: string | null;
    email: string | null;
    name: string | null;
    description: string | null;
    avatarUrl: string | null;
    userLevel?: 'ADMIN' | null;

    [key: string]: any; // Allow any additional properties

    constructor(initObj: Partial<User> & Record<string, any>) {
        this.id = initObj.id!;
        this.sub = initObj.sub ?? null;
        this.email = initObj.email ?? null;
        this.name = initObj.name ?? null;
        this.description = initObj.description ?? null;
        this.avatarUrl = initObj.avatarUrl ?? null;
        this.userLevel = initObj.userLevel;

        // Assign other properties from initObj to this instance
        for (const key in initObj) {
            if (initObj.hasOwnProperty(key) && !this.hasOwnProperty(key)) {
                this[key] = initObj[key];
            }
        }
    }
}