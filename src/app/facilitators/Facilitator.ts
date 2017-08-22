import { SFObject } from '../shared/models/SFObject.abstract';

export class Facilitator extends SFObject {

    private Id: string = '';
    private Email: string = '';
    private FirstName: string = '';
    private LastName: string = '';
    private AccountId: string = '';

    constructor(facilitator?: any) {
        super();
        if (facilitator) return Object.assign(this, facilitator);
    }

    public get sfId() { return this.Id; }
    public get email() { return this.Email; }
    public get name() { return `${this.FirstName} ${this.LastName}`; }
    public get firstName() { return this.FirstName; }
    public get lastName() { return this.LastName; }
    public get affiliateId() { return this.AccountId; }

    public set email(email: string) { this.Email = email; }
    public set firstName(name: string) { this.FirstName = name; }
    public set lastName(name: string) { this.LastName = name; }
    public set affiliateId(sfId: string) { this.AccountId = sfId; }

    public toSFJSON(): object {
        const sfFacilitator = {
            Id: this.sfId,
            Email: this.email,
            FirstName: this.firstName,
            LastName: this.lastName,
            AccountId: this.affiliateId
        }
        return sfFacilitator;
    }

    public toString(): string {
        return this.name;
    }
}