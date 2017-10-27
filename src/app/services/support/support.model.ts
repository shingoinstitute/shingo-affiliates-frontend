import { SFObject } from '../../shared/models/sf-object.abstract.model';

export class SupportPage extends SFObject {

  /* tslint:disable:variable-name */
  public Id: string;
  public Name: string;
  public Category__c: string;
  public Content__c: string;
  public Title__c: string;
  /* tslint:enable:variable-name */

  public get name(): string { return this.Name; }
  public get sfId(): string { return this.Id; }
  public get title(): string { return this.Title__c; }
  public get content(): string { return this.Content__c; }
  public get category(): string { return this.Category__c; }

  public constructor(supportPage?: any) {
    super();
    if (supportPage) Object.assign(this, supportPage);
  }

  public toJSON(): object {
    throw new Error("Method not implemented.");
  }
}