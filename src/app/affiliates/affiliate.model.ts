import { SFObject } from '../shared/models/sf-object.abstract.model';

export class Affiliate extends SFObject {

  public static get OBJECT_NAME(): string { return 'Affiliate'; }

  public static DEFAULT_LANGUAGE_OPTIONS: string[] = [
    'English',
    'Spanish',
    'French',
    'Portuguese',
    'Chinese',
    'Cantonese',
    'Dutch',
    'French',
    'German',
    'Hindi',
    'Italian',
    'Japanese',
    'Mandarin'
  ];

  public get sfId() { return this.Id; }

  public get name() { return this.Name; }
  public set name(name: string) { this.Name = name; }

  public get summary() { return this.Summary__c; }
  public set summary(summary: string) { this.Summary__c = summary; }

  public get logo() {
    if (this.Logo__c)
      return this.Logo__c.replace(/^http(?!s)/gi, 'https');
    return '';
  }
  public set logo(logo: string) { this.Logo__c = logo; }

  public get pagePath() { return `/affiliates/${this.sfId}`; }

  public get website() { return this.Website; }
  public set website(site: string) { this.Website = site; }

  public get languages(): string[] { return this.Languages__c ? this.Languages__c.split(',') : []; }
  public set languages(langs: string[]) { this.Languages__c = langs.join(); }

  public get publicContact() { return this.Public_Contact__c; }
  public set publicContact(contact: string) { this.Public_Contact__c = contact; }

  public get publicContactPhone() { return this.Public_Contact_Phone__c; }
  public set publicContactPhone(phone: string) { this.Public_Contact_Phone__c = phone; }

  public get publicContactEmail() { return this.Public_Contact_Email__c; }
  public set publicContactEmail(email: string) { this.Public_Contact_Email__c = email; }

  /* tslint:disable:variable-name */
  public Id: string = '';
  public Name: string = '';
  public Summary__c: string = '';
  public Logo__c: string = '';
  public Page_Path__c: string = '/affiliates';
  public Website: string = '';
  public Languages__c: string = '';
  public Public_Contact__c: string = '';
  public Public_Contact_Phone__c: string = '';
  public Public_Contact_Email__c: string = '';
  /* tslint:enable:variable-name */

  constructor(affiliate?: any) {
    super();
    if (affiliate) return Object.assign(this, affiliate);
  }

  public addLanguage(language: string): void {
    this.Languages__c = Array.from(new Set(this.languages.concat([language]))).join();
  }

  public removeLangauge(language: string): void {
    this.Languages__c = this.languages.filter(l => l.toLowerCase() !== language.toLowerCase()).join();
  }

  public toJSON(): object {
    return {
      Id: this.sfId,
      Name: this.name,
      Summary__c: this.summary,
      Logo__c: this.logo,
      Page_Path__c: this.pagePath,
      Website: this.website,
      Languages__c: this.languages.join(),
      Public_Contact__c: this.publicContact,
      Public_Contact_Phone__c: this.publicContactPhone,
      Public_Contact_Email__c: this.publicContactEmail
    };
  }
}
