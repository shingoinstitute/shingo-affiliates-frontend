import { Affiliate } from '../affiliates/Affiliate';
import { Facilitator } from '../facilitators/Facilitator';
import { CourseManager } from '../shared/models/CourseManager';
import { SFObject } from '../shared/models/SFObject.abstract';
import * as dateFormat from 'dateformat';

export type WorkshopType = 'Discover' | 'Enable' | 'Improve' | 'Align' | 'Build' | '' | undefined;
export type WorkshopStatusType = 'Invoiced, Not Paid' |
    'Finished, waiting for attendee list' |
    'Awaiting Invoice' |
    'Proposed' |
    'Archived' |
    'Cancelled' |
    'Active, not ready for app' |
    'Active Event' |
    '' |
    undefined;

/**
 * @desc Defines the interface to work with Workshops. Also provides a 'Facade' of the Salesforce API Naming conventions.
 * 
 * @export
 * @class Workshop
 */
export class Workshop extends SFObject {
    // Private members
    private Id: string = '';
    private Start_Date__c: Date = new Date();
    private End_Date__c: Date = new Date(Date.now() + (1000 * 60 * 60 * 24));
    private Course_Manager__r: CourseManager = new CourseManager();
    private Course_Manager__c: string = '';
    private facilitators: Facilitator[] = [];
    private Event_City__c: string = '';
    private Event_Country__c: string = '';
    private Host_Site__c: string = '';
    private Organizing_Affiliate__c: string = '';
    private Organizing_Affiliate__r: Affiliate = new Affiliate();
    private Public__c: boolean = false;
    private Registration_Website__c: string = '';
    private Status__c: WorkshopStatusType = 'Proposed';
    private Workshop_Type__c: WorkshopType = 'Discover';
    private Billing_Contact__c: string = '';
    private Language__c: string = 'English';
    public files: any[] = [];

    // Be careful because Object.assign will assign variables dynamically: eg
    //  new Workshop({Id: 'some id', otherProp: 42}) => {Id: 'some id', otherProp: 42} that has type Workshop
    constructor(workshop?: any) {
        super();
        if (workshop) {
            workshop.Organizing_Affiliate__r = new Affiliate(workshop.Organizing_Affiliate__r);
            workshop.Course_Manager__r = new CourseManager(workshop.Course_Manager__r);
            if (workshop.facilitators && workshop.facilitators instanceof Array)
                workshop.facilitators = workshop.facilitators.map(fac => new Facilitator(fac));
            return Object.assign(this, workshop)
        }
    }

    // Public getters
    public get sfId(): string { return this.Id; }
    public get startDate(): Date { return this.Start_Date__c; }
    public get startDateFormatted(): string { return Workshop.formatDate(this.startDate); }
    public get endDate(): Date { return this.End_Date__c; }
    public get endDateFormatted(): string { return Workshop.formatDate(this.endDate); }
    public get courseManager(): CourseManager { return this.Course_Manager__r; }
    public get courseManagerId(): string { return (this.Course_Manager__r ? this.Course_Manager__r.sfId : this.Course_Manager__c); }
    public get instructors(): Facilitator[] { return this.facilitators; }
    public get city(): string { return this.Event_City__c; }
    public get country(): string { return this.Event_Country__c; }
    public get hostSite(): string { return this.Host_Site__c; }
    public get affiliate(): Affiliate { return this.Organizing_Affiliate__r; }
    public get affiliateId(): string { return this.Organizing_Affiliate__c || this.Organizing_Affiliate__r.sfId; }
    public get isPublic(): boolean { return this.Public__c; }
    public get website(): string { return this.Registration_Website__c; }
    public get status(): WorkshopStatusType { return this.Status__c; }
    public get type(): WorkshopType { return this.Workshop_Type__c; }
    public get billing(): string { return this.Billing_Contact__c; }
    public get language(): string { return this.Language__c; }
    public get image(): string {
        switch (this.Workshop_Type__c.toLowerCase()) {
            case 'improve':
                return 'assets/imgs/shingo/Improve.png';
            case 'discover':
                return 'assets/imgs/shingo/Discover.png';
            case 'build':
                return 'assets/imgs/shingo/Build.png';
            case 'align':
                return 'assets/imgs/shingo/Align.png';
            case 'enable':
                return 'assets/imgs/shingo/Enable.png';
            default:
                return '';
        }
    }
    public get isVerified(): boolean {
        return this.Status__c.toLowerCase() !== 'proposed';
    }
    public get dueDate(): string {
        const dueDate = new Date(this.endDate).valueOf() + (1000 * 60 * 60 * 24 * 7)
        return Workshop.formatDate(new Date(dueDate));
    }
    public get location(): string {
        return `${this.city}, ${this.country}`;
    }

    // Public Setters
    public set startDate(date: Date) { this.Start_Date__c = date; }
    public set endDate(date: Date) { this.End_Date__c = date; }
    public set courseManager(cm: CourseManager) { this.Course_Manager__r = cm; }
    public set city(city: string) { this.Event_City__c = city; }
    public set country(country: string) { this.Event_Country__c = country; }
    public set hostSite(site: string) { this.Host_Site__c = site; }
    public set affiliate(affiliate: Affiliate) { this.Organizing_Affiliate__r = affiliate; }
    public set affiliateId(id: string) { this.Organizing_Affiliate__c = id; }
    public set isPublic(isPublic: boolean) { this.Public__c = isPublic; }
    public set website(website: string) { this.Registration_Website__c = website; }
    public set status(status: WorkshopStatusType) { this.Status__c = status; }
    public set type(type: WorkshopType) { this.Workshop_Type__c = type; }
    public set billing(email: string) { this.Billing_Contact__c = email; }
    public set language(langauge: string) { this.Language__c = langauge; }

    // Public "setter" for instructors
    public addInstructor(facilitator: Facilitator): void {
        if (this.facilitators.findIndex(fac => fac['Id'] === facilitator.sfId) !== -1) return;
        this.facilitators.push(facilitator);
    }
    public removeInstructorById(sfId: string): void { this.facilitators = this.facilitators.filter(f => f['Id'] !== sfId); }
    public removeInstructorByIndex(index: number): void { this.facilitators.splice(index, 1); }

    // Utility methods
    public toSFJSON(): object {
        const sfWorkshop = {
            Id: this.sfId,
            Start_Date__c: this.startDate,
            End_Date__c: this.endDate,
            Course_Manager__c: this.courseManagerId,
            facilitators: this.instructors,
            Event_City__c: this.city,
            Event_Country__c: this.country,
            Host_Site__c: this.hostSite,
            Organizing_Affiliate__c: this.affiliateId,
            Public__c: this.isPublic,
            Registration_Website__c: this.website,
            Status__c: this.status,
            Workshop_Type__c: this.type,
            Billing_Contact__c: this.billing,
            Language__c: this.language
        }
        return sfWorkshop;
    }

    private static formatDate(d: string | number | Date) {
        const date: any = d;
        try {
            return dateFormat(new Date(date), 'dd mmm, yyyy');
        } catch (e) {
            return "";
        }
    }
}