import * as dateFormat from 'dateformat'

import { Affiliate } from '../affiliates/affiliate.model'
import { SFObject } from '../shared/models/sf-object.abstract.model'

export type FacilitatorRoleType =
  | 'Facilitator'
  | 'Course Manager'
  | 'Affiliate Manager'

export class Facilitator extends SFObject {
  public static DEFAULT_ROLE_OPTIONS: FacilitatorRoleType[] = [
    'Facilitator',
    'Course Manager',
    'Affiliate Manager',
  ]

  public get sfId() {
    return this.Id
  }

  public get email() {
    return this.Email
  }
  public set email(email: string) {
    this.Email = email
  }

  public get firstName() {
    return this.FirstName
  }
  public set firstName(name: string) {
    this.FirstName = name
  }

  public get lastName() {
    return this.LastName
  }
  public set lastName(name: string) {
    this.LastName = name
  }

  public get affiliateId() {
    return this.AccountId || this.Account.sfId || ''
  }
  public set affiliateId(sfId: string) {
    this.AccountId = sfId
  }

  public get photo() {
    return this.Photograph__c
  }
  public set photo(url: string) {
    this.Photograph__c = url
  }

  public get biography() {
    return this.Biography__c
  }
  public set biography(bio: string) {
    this.Biography__c = bio
  }

  public get title() {
    return this.Title
  }
  public set title(title: string) {
    this.Title = title
  }

  public get affiliate() {
    return this.Account
  }
  public set affiliate(a: Affiliate) {
    this.Account = a
    this.affiliateId = a.sfId
  }

  public get role() {
    if (String(this._role.name).match(/(Course Manager)/gi)) {
      return 'Course Manager'
    }
    return this._role.name as FacilitatorRoleType
  }
  public set role(role: FacilitatorRoleType | { name: string }) {
    if (role && role['name']) role = role['name']

    if (role === 'Course Manager') {
      this._role.name = `${role} -- ${this.affiliateId}`
    } else this._role.name = role as string
  }

  public get name() {
    return `${this.FirstName} ${this.LastName}`
      .split(' ')
      .filter(s => s.length > 0)
      .join(' ')
  }
  public set name(name: string) {
    const names = name.split(' ').filter(n => n.length > 0)
    if (names.length === 0) {
      this.firstName = this.lastName = ''
    } else if (names.length === 1) {
      this.firstName = names.pop()
      this.lastName = ''
    } else if (names.length > 1) {
      this.lastName = names.pop()
      this.firstName = names.join(' ')
    }
  }

  public get id() {
    return this._id
  }

  public get lastLogin() {
    if (this._lastLogin === '') return null
    return dateFormat(new Date(this._lastLogin), 'dd mmm, yyyy @ hh:mm:ss')
  }

  // SF Properties
  /* tslint:disable:variable-name */
  public Id = ''
  public Email = ''
  public FirstName = ''
  public LastName = ''
  public AccountId = ''
  public Photograph__c =
    'https://res.cloudinary.com/shingo/image/upload/c_thumb,e_trim:10,g_center,h_100,w_100/v1414874243/silhouette_vzugec.png'
  public Biography__c = ''
  public Title = ''
  public Account: Affiliate = new Affiliate()
  /* tslint:enable:variable-name */

  // Auth Properties
  public _id: number
  public _role: { name: string } = { name: 'Facilitator' }
  public _lastLogin: string

  constructor(facilitator?: any) {
    super()
    if (facilitator) {
      facilitator.Account = new Affiliate(facilitator.Account)
      facilitator._id = facilitator.id
      facilitator._lastLogin = facilitator.lastLogin
      delete facilitator.id
      delete facilitator.lastLogin
      return Object.assign(this, facilitator)
    }
  }

  public toJSON(): object {
    return {
      Id: this.sfId,
      Email: this.email,
      FirstName: this.firstName,
      LastName: this.lastName,
      AccountId: this.affiliateId,
      Title: this.title,
      Biography__c: this.biography,
      Photograph__c: this.photo,
      id: this.id,
      role: this._role,
      __name: this.name,
    }
  }

  public toString(): string {
    return this.name
  }
}
