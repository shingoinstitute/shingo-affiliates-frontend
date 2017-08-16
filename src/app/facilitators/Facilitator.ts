export class Facilitator {
    private Id: string;
    private Email: string;
    private FirstName: string;
    private LastName: string;
    private AccountId: string;

    constructor(facilitator: any) {
        return Object.assign(this, facilitator);
    }

    get sfId() { return this.Id; }
    get email() { return this.Email; }
    get name() { return `${this.FirstName} ${this.LastName}`; }
    get firstName() { return this.FirstName; }
    get lastName() { return this.LastName; }
    get affiliateId() { return this.AccountId; }

    set email(email: string) { this.Email = email; }
    set firstName(name: string) { this.FirstName = name; }
    set lastName(name: string) { this.LastName = name; }
    set affilaiteId(sfId: string) { this.AccountId = sfId; }
}