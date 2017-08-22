import { SFObject } from '../shared/models/SFObject.abstract';

export class Facilitator extends SFObject {

   private Id: string = '';
   private Email: string = '';
   private FirstName: string = '';
   private LastName: string = '';
   private AccountId: string = '';
   private Photograph__c: string = '';

   constructor(facilitator?: any) {
      super();
      if (facilitator) return Object.assign(this, facilitator);
   }

   public get sfId() { return this.Id; }
   public get email() { return this.Email; }
   public get firstName() { return this.FirstName; }
   public get lastName() { return this.LastName; }
   public get affiliateId() { return this.AccountId; }
   // public get 
   public get name() {
      return `${this.FirstName} ${this.LastName}`
         .split(' ')
         .filter(s => { return s.length > 0; })
         .join(' ');
   }

   public set email(email: string) { this.Email = email; }
   public set firstName(name: string) { this.FirstName = name; }
   public set lastName(name: string) { this.LastName = name; }
   public set affiliateId(sfId: string) { this.AccountId = sfId; }
   public set name(name: string) {
      let names = name.split(' ').filter(n => { return n.length > 0; });
      if (names.length == 0) {
         this.firstName = this.lastName = '';
      } else if (names.length == 1) {
         this.firstName = names.pop();
         this.lastName = '';
      } else if (names.length > 1) {
         this.lastName = names.pop();
         this.firstName = names.join(' ');
      }
   }

   public toSFJSON(): object {
      let sfFacilitator: any = {
         Email: this.email,
         FirstName: this.firstName,
         LastName: this.lastName,
         AccountId: this.affiliateId
      };

      if (this.Id.length > 0)
         sfFacilitator.Id = this.Id;

      return sfFacilitator;
   }

   public toString(): string {
      return this.name;
   }
}