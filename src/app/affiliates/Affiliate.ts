import { SFObject } from '../shared/SFObject.abstract';

export class Affiliate extends SFObject {

    private Id: string = '';
    private Name: string = '';
    private Summary__c: string = '';
    private Logo__c: string = '';
    private Page_Path__c: string = '';
    private Website: string = '';
    private Languages__c: string = '';

    constructor(affiliate?: any) {
        super();
        if (affiliate) return Object.assign(this, affiliate);
    }

    public get sfId() { return this.Id; }
    public get name() { return this.Name; }
    public get summary() { return this.Summary__c; }
    public get logo() { return this.Logo__c; }
    public get pagePath() { return this.Page_Path__c; }
    public get website() { return this.Website; }
    public get languages() { return this.Languages__c.split(','); }

    public set name(name: string) { this.Name = name; }
    public set summary(summary: string) { this.Summary__c = summary; }
    public set logo(logo: string) { this.Logo__c = logo; }
    public set pagePath(path: string) { this.Page_Path__c = path; }
    public set website(site: string) { this.Website = site; }

    public addLanguage(language: string): void {
        if (this.languages.findIndex(l => l.toLowerCase() === language.toLowerCase()) !== -1) return;
        this.Languages__c += `,${language}`;
    }

    public removeLangauge(language: string): void {
        this.Languages__c = this.languages.filter(l => l.toLowerCase() === language.toLowerCase()).join();
    }

    public toSFJSON(): object {
        const sfAffiliate = {
            Id: this.sfId,
            Name: this.name,
            Summary__c: this.summary,
            Logo__c: this.logo,
            Page_Path__c: this.pagePath,
            Website: this.website,
            Languages__c: this.Languages__c
        }
        return sfAffiliate;
    }
}