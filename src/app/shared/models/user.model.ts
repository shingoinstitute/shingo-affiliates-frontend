export enum UserState {
  Normal,
  LoggedInAs,
}

export class User {
  public get sfId(): string {
    return this.Id
  }
  public get name(): string {
    return this.Name
  }
  public get email(): string {
    return this.Email
  }
  public get affiliate(): string {
    return this.AccountId
  }
  public get authId(): number {
    return this.id
  }
  public get roleName(): string {
    return this.role.name
  }
  public get title(): string {
    return this.Title
  }
  public get photo(): string {
    return this.Photograph__c
  }
  public get bio(): string {
    return this.Biography__c
  }
  public get isAdmin(): boolean {
    return this.role && this.roleName === 'Affiliate Manager'
  }

  public get state(): UserState {
    return this._state
  }
  public set state(state: UserState) {
    this._state = state
  }
  // SF Properties
  /* tslint:disable:variable-name */
  private Id!: string
  private Name!: string
  private Email!: string
  private AccountId!: string
  private Title!: string
  private Photograph__c!: string
  private Biography__c!: string
  private _state: UserState = UserState.Normal
  /* tslint:enable:variable-name */

  // Auth Properties
  private id!: number
  private role!: { id: number; name: string }

  constructor(user?: any) {
    if (user) return Object.assign(this, user)
  }
}
