import { SFObject } from '../shared/models/SFObject.abstract';

export class Affiliate extends SFObject {

    public static DEFAULT_LANGUAGE_OPTIONS: string[] = ['English', 'Spanish', 'German', 'French', 'Mandarin', 'Cantonese', 'Italian', 'Hindi', 'Portuguese (Brazilian)', 'Japanese', 'Dutch', 'Chinese'];

    private Id: string = '';
    private Name: string = '';
    private Summary__c: string = '';
    private Logo__c: string = '';
    private Page_Path__c: string = '/affiliates';
    private Website: string = '';
    private Languages__c: string = '';
    private Public_Contact__c: string = '';
    private Public_Contact_Phone__c: string = '';
    private Public_Contact_Email__c: string = '';

    constructor(affiliate?: any) {
        super();
        if (affiliate) return Object.assign(this, affiliate);
    }

    public get sfId() { return this.Id; }
    public get name() { return this.Name; }
    public get summary() { return this.Summary__c; }
    public get logo() { return this.Logo__c; }
    public get pagePath() { return `${this.Page_Path__c}/${this.sfId}`; }
    public get website() { return this.Website; }
    public get languages(): string[] { return this.Languages__c ? this.Languages__c.split(',') : []; }
    public get publicContact() { return this.Public_Contact__c; }
    public get publicContactPhone() { return this.Public_Contact_Phone__c; }
    public get publicContactEmail() { return this.Public_Contact_Email__c; }

    public set name(name: string) { this.Name = name; }
    public set summary(summary: string) { this.Summary__c = summary; }
    public set logo(logo: string) { this.Logo__c = logo; }
    public set website(site: string) { this.Website = site; }
    public set publicContact(contact: string) { this.Public_Contact__c = contact; }
    public set publicContactPhone(phone: string) { this.Public_Contact_Phone__c = phone; }
    public set publicContactEmail(email: string) { this.Public_Contact_Email__c = email; }
    public set languages(langs: string[]) { this.Languages__c = langs.join(); }

    public addLanguage(language: string): void {
        this.Languages__c = Array.from(new Set(this.languages.concat([language]))).join();
    }

    public removeLangauge(language: string): void {
        this.Languages__c = this.languages.filter(l => l.toLowerCase() !== language.toLowerCase()).join();
    }

    public toSFJSON(): object {
        const sfAffiliate = {
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
        }
        return sfAffiliate;
    }
}