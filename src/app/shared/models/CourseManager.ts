import { SFObject } from './SFObject.abstract';

export class CourseManager extends SFObject {

  /* tslint:disable:variable-name */
  private Id: string;
  private Name: string;
  private Email: string;
  /* tslint:enable:variable-name */

  constructor(courseManager?) {
    super();
    if (courseManager) return Object.assign(this, courseManager);
  }

  public get sfId() { return this.Id; }
  public get name() { return this.Name; }
  public get email() { return this.Email; }

  public toJSON(): object {
    return {
      Id: this.sfId,
      Name: this.name,
      Email: this.email
    };
  }

  public toString(): string {
    return this.name;
  }

}