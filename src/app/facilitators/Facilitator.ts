import { SFObject } from '../shared/models/SFObject.abstract';
import { Affiliate } from "../affiliates/Affiliate";

export class Facilitator extends SFObject {

   private Id: string = '';
   private Email: string = '';
   private FirstName: string = '';
   private LastName: string = '';
   private AccountId: string = '';
   private Photograph__c: string = 'http://res.cloudinary.com/shingo/image/upload/c_thumb,e_trim:10,g_center,h_100,w_100/v1414874243/silhouette_vzugec.png';
   private Account: Affiliate = new Affiliate();

   constructor(facilitator?: any) {
      super();
      if (facilitator) {
        facilitator.Account = new Affiliate(facilitator.Account);
        return Object.assign(this, facilitator);
      }
   }

   public get sfId() { return this.Id; }
   public get email() { return this.Email; }
   public get firstName() { return this.FirstName; }
   public get lastName() { return this.LastName; }
   public get affiliateId() { return this.AccountId || this.Account.sfId || ''; }
   public get photo() { return this.Photograph__c; }
   public get affiliate() { return this.Account; }
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
   public set photo(url: string) { this.Photograph__c = url; }
   public set affiliate(a: Affiliate) {
    this.Account = a; 
    this.affiliateId = a.sfId;
   }
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
      let sfFacilitator = {
         Email: this.email,
         FirstName: this.firstName,
         LastName: this.lastName,
         AccountId: this.affiliateId,
         Id: this.Id
      };

      return sfFacilitator;
   }

   public toString(): string {
      return this.name;
   }
}