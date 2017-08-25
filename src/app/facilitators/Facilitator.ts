import { SFObject } from '../shared/models/SFObject.abstract';
import { Affiliate } from "../affiliates/Affiliate";
  
export type FacilitatorRoleType = 'Facilitator' | 'Course Manager' | 'Affiliate Manager';

export class Facilitator extends SFObject {

  public static DEFAULT_ROLE_OPTIONS: FacilitatorRoleType[] = ['Facilitator', 'Course Manager', 'Affiliate Manager'];

   private Id: string = '';
   private Email: string = '';
   private FirstName: string = '';
   private LastName: string = '';
   private AccountId: string = '';
   private Photograph__c: string = 'http://res.cloudinary.com/shingo/image/upload/c_thumb,e_trim:10,g_center,h_100,w_100/v1414874243/silhouette_vzugec.png';
   private Biography__c: string = '';
   private Title: string = '';
   private Account: Affiliate = new Affiliate();
   private _role: { name: string } = { name: 'Facilitator' }

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
   public get biography() { return this.Biography__c; }
   public get title() { return this.Title; }
   public get affiliate() { return this.Account; }
   public get role() {
     if (String(this._role.name).includes('Course Manager')) {
       return 'Course Manager';
     }
     return this._role.name as FacilitatorRoleType;
   }
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
   public set title(title: string) { this.Title = title; }
   public set biography(bio: string) { this.Biography__c = bio; }
   public set affiliate(a: Affiliate) {
    this.Account = a; 
    this.affiliateId = a.sfId;
   }
  public set role(role: FacilitatorRoleType | { name: string }) {
    if (role && role['name']) {
      role = role['name'];
    }

    if (role === 'Course Manager') {
      this._role.name = `${role} -- ${this.affiliateId}`;
    } else {
      this._role.name = role as string;
    }
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
        Id: this.Id,
        Email: this.email,
        FirstName: this.firstName,
        LastName: this.lastName,
        AccountId: this.affiliateId,
        Title: this.title,
        Biography__c: this.biography,
        role: this._role
      };
      return sfFacilitator;
   }

   public toString(): string {
      return this.name;
   }
}