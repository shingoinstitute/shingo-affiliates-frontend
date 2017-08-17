export class User {
    private Id: string;
    private Email: string;
    private AccountId: string;
    
    private id: number;
    private role: { name: string };

    constructor(user?) {
        if(user) return Object.assign(this, user);
    }

    public get sfId(): string { return this.Id; }
    public get email(): string { return this.Email; }
    public get affilaite(): string { return this.AccountId; }
    public get authId(): number { return this.id; }
    public get roleName(): string { return this.role.name; }
}