import { Facilitator } from '../facilitators/Facilitator';

export interface CourseManager {
    Id: string,
    Email: string,
    FirstName: string,
    LastName: string,
    Name: string
}

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

export class Workshop {
    private Id: string;
    private Start_Date__c: Date;
    private End_Date__c: Date;
    private Course_Manager__r: CourseManager;
    private Course_Manager__c: string;
    private facilitators: Facilitator[];
    private Event_City__c: string;
    private Event_Country__c: string;
    private Host_Site__c: string;
    private Organizing_Affiliate__c: string;
    private Public__c: boolean = false;
    private Registration_Website__c: string;
    private Status__c: WorkshopStatusType;
    private Workshop_Type__c: WorkshopType;
    private Billing_Contact__c: string;
    private Language__c: string;

    constructor(workshop?: any) {
        return Object.assign(this, workshop);
    }

    get sfId() { return this.Id; }
    get startDate() { return this.Start_Date__c; }
    get endDate() { return this.End_Date__c; }
    get courseManager() { return this.Course_Manager__r; }
    get courseManagerId() { return (this.Course_Manager__r ? this.Course_Manager__r.Id : this.Course_Manager__c); }
    get instructors() { return this.facilitators; }
    get city() { return this.Event_City__c; }
    get country() { return this.Event_Country__c; }
    get hostSite() { return this.Host_Site__c; }
    get affiliateId() { return this.Organizing_Affiliate__c; }
    get isPublic() { return this.Public__c; }
    get website() { return this.Registration_Website__c; }
    get status() { return this.Status__c; }
    get type() { return this.Workshop_Type__c; }
    get billing() { return this.Billing_Contact__c; }
    get language() { return this.Language__c; }

    set startDate(date: Date) { this.Start_Date__c = date; }
    set endDate(date: Date) { this.End_Date__c = date; }
    set courseManager(cm: CourseManager) { this.Course_Manager__r = cm; }
    set city(city: string) { this.Event_City__c = city; }
    set country(country: string) { this.Event_Country__c = country; }
    set hostSite(site: string) { this.Host_Site__c = site; }
    set affiliateId(id: string) { this.Organizing_Affiliate__c = id; }
    set isPublic(isPublic: boolean) { this.Public__c = isPublic; }
    set website(website: string) { this.Registration_Website__c = website; }
    set status(status: WorkshopStatusType) { this.Status__c = status; }
    set type(type: WorkshopType) { this.Workshop_Type__c = type; }
    set billing(email: string) { this.Billing_Contact__c = email; }
    set language(langauge: string) { this.Language__c = langauge; }

    public addInstructor(facilitator: Facilitator): void { this.facilitators.push(facilitator); }
    public removeInstructorById(sfId: string): void { this.facilitators = this.facilitators.filter(f => f.sfId !== sfId); }
    public removeInstructorByIndex(index: number): void { this.facilitators.splice(index, 1); }

    public toSfJSON(): object {
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
            Workshop_Type__c: this.type
        }
        return sfWorkshop;
    }
}