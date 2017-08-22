import { SFObject } from '../shared/models/SFObject.abstract';

export class Facilitator extends SFObject {

    private Id: string = '';
    private Email: string = '';
    private FirstName: string = '';
    private LastName: string = '';
    private AccountId: string = '';
    private Photograph__c: string = 'http://res.cloudinary.com/shingo/image/upload/c_thumb,e_trim:10,g_center,h_100,w_100/v1414874243/silhouette_vzugec.png';

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
    public get photo() { return this.Photograph__c; }

    public set email(email: string) { this.Email = email; }
    public set firstName(name: string) { this.FirstName = name; }
    public set lastName(name: string) { this.LastName = name; }
    public set affilaiteId(sfId: string) { this.AccountId = sfId; }
    public set photo(url: string) { this.Photograph__c = url; }

    public toSFJSON(): object {
        const sfFacilitator = {
            Id: this.sfId,
            Email: this.email,
            FirstName: this.firstName,
            LastName: this.lastName,
            AccountId: this.affilaiteId
        }
        return sfFacilitator;
    }

    public toString(): string {
        return this.name;
    }
}