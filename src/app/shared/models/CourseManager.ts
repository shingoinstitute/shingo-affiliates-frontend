import { SFObject } from './SFObject.abstract';

export class CourseManager extends SFObject {

    private Id: string;
    private Name: string;
    private Email: string;

    constructor(courseManager?) {
        super();
        if (courseManager) return Object.assign(this, courseManager);
    }

    public get sfId() { return this.Id; }
    public get name() { return this.Name; }
    public get email() { return this.Email; }

    public toSFJSON(): object {
        const sfCourseManager = {
            Id: this.sfId,
            Name: this.name,
            Email: this.email
        }

        return sfCourseManager;
    }

    public toString(): string {
        return this.name;
    }

}