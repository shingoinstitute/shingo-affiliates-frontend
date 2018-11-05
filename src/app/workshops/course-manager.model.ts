import { SFObject } from '../shared/models/sf-object.abstract.model'

export class CourseManager extends SFObject {
  /* tslint:disable:variable-name */
  public Id!: string
  public Name!: string
  public Email!: string
  /* tslint:enable:variable-name */

  constructor(courseManager?: any) {
    super()
    if (courseManager) return Object.assign(this, courseManager)
  }

  public get sfId() {
    return this.Id
  }
  public get name() {
    return this.Name
  }
  public get email() {
    return this.Email
  }

  public toJSON(): object {
    return {
      Id: this.sfId,
      Name: this.name,
      Email: this.email,
    }
  }

  public toString(): string {
    return this.name
  }
}
