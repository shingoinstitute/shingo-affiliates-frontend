import { SFObject } from '../shared/models/sf-object.abstract.model'
import { ReadAllReturn, ReadReturn } from './services/affiliate.service'
import { MakeKeysOptional } from '~app/util/types'
import { Account } from '@shingo/affiliates-api/sf-interfaces/Account.interface'
import { GLOBAL_ID_PREFIX, isPortalCreated, addIf } from '~app/util/util'

/* ================
 * TYPE DEFINITIONS
 * ================
 */

export type AffiliateBase = ReadAllReturn &
  MakeKeysOptional<ReadReturn, Exclude<keyof ReadReturn, keyof ReadAllReturn>>

export { Account }

/* ==================
 * ACCESSOR FUNCTIONS
 * ==================
 */
export const DEFAULT_LANGUAGE_OPTIONS: ReadonlyArray<string> = [
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
  'Mandarin',
  'Arabic',
  'Russian',
  'Polish',
]

export const name = (a: AffiliateBase) => a.Name
export const summary = (a: AffiliateBase) => a.Summary__c || undefined
export const logo = (a: AffiliateBase) => a.Logo__c || undefined
export const pagePath = (a: AffiliateBase) => `/affiliates/${a.Id}`
export const website = (a: AffiliateBase) => a.Website || undefined
export const languages = (a: AffiliateBase) =>
  a.Languages__c ? a.Languages__c.split(',') : []
export const publicContact = (a: AffiliateBase) =>
  a.Public_Contact__c || undefined
export const publicContactPhone = (a: AffiliateBase) =>
  a.Public_Contact_Phone__c || undefined
export const publicContactEmail = (a: AffiliateBase) =>
  a.Public_Contact_Email__c || undefined

let idCounter = 0

export const AFFILIATE_PREFIX = 'AFFILIATE'
export const ID_PREFIX = GLOBAL_ID_PREFIX + AFFILIATE_PREFIX

/**
 * Formats an AffiliateBase object for consumption by salesforce
 */
export const toJSON = (a: AffiliateBase) => {
  const ret: Partial<AffiliateBase> = {
    Name: a.Name,
  }
  if (!isPortalCreated(a, AFFILIATE_PREFIX)) {
    ret.Id = a.Id
  }

  addIf(ret, 'Summary__c', a.Summary__c)
  addIf(ret, 'Logo__c', a.Logo__c)
  addIf(ret, 'Page_Path__c', a.Page_Path__c)
  addIf(ret, 'Website', a.Website)
  addIf(ret, 'Languages__c', languages(a).join(','))
  addIf(ret, 'Public_Contact__c', a.Public_Contact__c)
  addIf(ret, 'Public_Contact_Phone__c', a.Public_Contact_Phone__c)
  addIf(ret, 'Public_Contact_Email__c', a.Public_Contact_Email__c)

  return ret
}

export const affiliate = (init: Partial<AffiliateBase> = {}): AffiliateBase => {
  const base: AffiliateBase = {
    Id: `${ID_PREFIX}:${idCounter++}`,
    Name: '',
  }
  return { ...base, ...init, Id: base.Id }
}

/** @deprecated Use AffiliateBase */
export class Affiliate extends SFObject {
  public static get OBJECT_NAME(): string {
    return 'Affiliate'
  }

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
    'Mandarin',
    'Arabic',
    'Russian',
    'Polish',
  ]

  public get sfId() {
    return this.Id
  }

  public get name() {
    return this.Name
  }
  public set name(name: string) {
    this.Name = name
  }

  public get summary() {
    return this.Summary__c
  }
  public set summary(summary: string) {
    this.Summary__c = summary
  }

  public get logo() {
    if (this.Logo__c) {
      return this.Logo__c.replace(/^http(?!s)/gi, 'https')
    }
    return ''
  }
  public set logo(logo: string) {
    this.Logo__c = logo
  }

  public get pagePath() {
    return `/affiliates/${this.sfId}`
  }

  public get website() {
    return this.Website
  }
  public set website(site: string) {
    this.Website = site
  }

  public get languages(): string[] {
    return this.Languages__c ? this.Languages__c.split(',') : []
  }
  public set languages(langs: string[]) {
    this.Languages__c = langs.join()
  }

  public get publicContact() {
    return this.Public_Contact__c
  }
  public set publicContact(contact: string) {
    this.Public_Contact__c = contact
  }

  public get publicContactPhone() {
    return this.Public_Contact_Phone__c
  }
  public set publicContactPhone(phone: string) {
    this.Public_Contact_Phone__c = phone
  }

  public get publicContactEmail() {
    return this.Public_Contact_Email__c
  }
  public set publicContactEmail(email: string) {
    this.Public_Contact_Email__c = email
  }

  /* tslint:disable:variable-name */
  public Id = ''
  public Name = ''
  public Summary__c = ''
  public Logo__c = ''
  public Page_Path__c = '/affiliates'
  public Website = ''
  public Languages__c = ''
  public Public_Contact__c = ''
  public Public_Contact_Phone__c = ''
  public Public_Contact_Email__c = ''
  /* tslint:enable:variable-name */

  constructor(affiliate?: any) {
    super()
    if (affiliate) return Object.assign(this, affiliate)
  }

  public addLanguage(language: string): void {
    this.Languages__c = Array.from(
      new Set(this.languages.concat([language])),
    ).join()
  }

  public removeLangauge(language: string): void {
    this.Languages__c = this.languages
      .filter(l => l.toLowerCase() !== language.toLowerCase())
      .join()
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
      Public_Contact_Email__c: this.publicContactEmail,
    }
  }
}
