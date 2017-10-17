
export class SupportPage {
  /* tslint:disable:variable-name */
  public Category__c: string;
  public Content__c: string;
  public Title__c: string;
  /* tslint:enable:variable-name */

  public get title(): string { return this.Title__c; }
  public get content(): string { return this.Content__c; }
  public get category(): string { return this.Category__c; }

  constructor(supportPage?: any) {
    if (supportPage) Object.assign(this, supportPage);
  }
}