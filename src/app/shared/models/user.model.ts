export class User {

  public get sfId(): string { return this.Id; }
  public get name(): string { return this.Name; }
  public get email(): string { return this.Email; }
  public get affiliate(): string { return this.AccountId; }
  public get authId(): number { return this.id; }
  public get roleName(): string { return this.role.name; }
  public get title(): string { return this.Title; }
  public get photo(): string { return this.Photograph__c; }
  public get bio(): string { return this.Biography__c; }
  public get isAdmin(): boolean { return this.role && this.roleName === 'Affiliate Manager'; }

  // SF Properties
  /* tslint:disable:variable-name */
  public Id: string;
  public Name: string;
  public Email: string;
  public AccountId: string;
  public Title: string;
  public Photograph__c: string;
  public Biography__c: string;
  /* tslint:enable:variable-name */

  // Auth Properties
  public id: number;
  public role: { id: number, name: string };

  constructor(user?) {
    if (user) return Object.assign(this, user);
  }
}