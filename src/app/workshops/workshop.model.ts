import moment, { Moment, isMoment } from 'moment'
import { getIsoYMD, addIf } from '../util/util'
import { ReadAllReturn, ReadReturn } from './services/workshop.service'
import { MakeKeysOptional, ToReadonlyArray, Overwrite } from '~app/util/types'
import { Workshop__c } from '@shingo/affiliates-api/sf-interfaces/Workshop__c.interface'
import { compose } from '~app/util/functional'
// tslint:disable: no-use-before-declare

/* ================
 * TYPE DEFINITIONS
 * ================
 */

/**
 * The possible type resulting from a call to WorkshopService.getAll or WorkshopService.getById
 *
 * ReadAllReturn is a subset of Workshop__c, which is a subset of ReadReturn
 * (because ReadReturn is Workshop__c plus files and facilitators)
 * therefore the combination is ReadAllReturn intersected with ReadReturn,
 * but those keys that are present in ReadReturn and not ReadAllReturn must be optional
 *
 * We don't care if Organizing_Affiliate__r and Course_Manager__r are proper Accounts,
 * because they are not used to create/update the workshop in SF
 * (we use their Ids as Organizing_Affiliate__c and Course_Manager__c)
 */
export type WorkshopBase = Overwrite<
  Base,
  {
    Organizing_Affiliate__r?: Partial<
      Exclude<Base['Organizing_Affiliate__r'], undefined>
    >
    Course_Manager__r?: Partial<Exclude<Base['Course_Manager__r'], undefined>>
  }
>
type Base = ReadAllReturn &
  MakeKeysOptional<ReadReturn, Exclude<keyof ReadReturn, keyof ReadAllReturn>>

export { Workshop__c }
export type Timezone = Workshop__c['Timezone__c']

export type WorkshopType = Exclude<
  Workshop__c['Workshop_Type__c'],
  null | undefined
>

export type WorkshopStatusType = Exclude<
  Workshop__c['Status__c'],
  null | undefined
>

export const WORKSHOP_COURSE_TYPES: ReadonlyArray<WorkshopType> = [
  'Discover',
  'Enable',
  'Improve',
  'Align',
  'Build',
]

export const WORKSHOP_STATUS_TYPES: ReadonlyArray<WorkshopStatusType> = [
  'Proposed',
  'Verified',
  'Action Pending',
  'Ready To Be Invoiced',
  'Invoiced, Not Paid',
  'Archived',
  'Cancelled',
]

/* ==================
 * ACCESSOR FUNCTIONS
 * ==================
 */

export const name = (w: WorkshopBase) => w.Name || undefined
export const nameFormatted = (w: WorkshopBase) =>
  `${type(w)} @ ${startDateFormatted(w)} - ${endDateFormatted(
    w,
  )} by ${(w.Organizing_Affiliate__r && w.Organizing_Affiliate__r.Name) ||
    'unknown'}`
export const startDate = (w: WorkshopBase) =>
  moment.tz(w.Start_Date__c, w.Timezone__c)
export const endDate = (w: WorkshopBase) =>
  moment.tz(w.End_Date__c, w.Timezone__c)
export const startDateFormatted = compose(
  formatDate,
  startDate,
)
export const endDateFormatted = compose(
  formatDate,
  endDate,
)
export const startTime = (w: WorkshopBase) =>
  addTimeAndTz(w.Start_Date__c, localStartTime(w), w.Timezone__c)
export const endTime = (w: WorkshopBase) =>
  addTimeAndTz(w.End_Date__c, localEndTime(w), w.Timezone__c)
export const localStartTime = (w: WorkshopBase) =>
  formatTime(w.Local_Start_Time__c)
export const localEndTime = (w: WorkshopBase) => formatTime(w.Local_End_Time__c)
export const lastModifiedDate = (w: WorkshopBase) =>
  new Date(w.LastModifiedDate)
export const courseManager = (w: WorkshopBase) =>
  w.Course_Manager__r || undefined
export const courseManagerId = (w: WorkshopBase) => {
  const manager = courseManager(w)
  return manager ? manager.Id : w.Course_Manager__c || undefined
}
export const instructors = (w: WorkshopBase) => w.facilitators || []
export const city = (w: WorkshopBase) => w.Event_City__c || undefined
export const country = (w: WorkshopBase) => w.Event_Country__c || undefined
export const hostSite = (w: WorkshopBase) => w.Host_Site__c || undefined
export const affiliate = (w: WorkshopBase) =>
  w.Organizing_Affiliate__r || undefined
export const affiliateId = (w: WorkshopBase) => {
  const aff = affiliate(w)
  return aff ? aff.Id : w.Organizing_Affiliate__c
}
export const website = (w: WorkshopBase) =>
  w.Registration_Website__c || undefined
export const status = (w: WorkshopBase) => w.Status__c || undefined
export const type = (w: WorkshopBase) => w.Workshop_Type__c || undefined
export const billing = (w: WorkshopBase) => w.Billing_Contact__c || undefined
export const language = (w: WorkshopBase) => w.Language__c || undefined
export const image = (w: WorkshopBase): string => {
  const wType = type(w)
  if (!wType) return ''
  switch (wType) {
    case 'Improve':
      return 'assets/imgs/shingo/Improve.png'
    case 'Discover':
      return 'assets/imgs/shingo/Discover.png'
    case 'Build':
      return 'assets/imgs/shingo/Build.png'
    case 'Align':
      return 'assets/imgs/shingo/Align.png'
    case 'Enable':
      return 'assets/imgs/shingo/Enable.png'
  }
}
export const isVerified = (w: WorkshopBase) => {
  const stat = status(w)
  if (!stat) return false
  return stat !== 'Proposed'
}
export const dueDate = (w: WorkshopBase) =>
  moment(endDate(w).valueOf() + 1000 * 60 * 60 * 24 * 7)
export const dueDateFormatted = compose(
  formatDate,
  dueDate,
)
export const location = (w: WorkshopBase): string => {
  const region = city(w)
  const nation = country(w)
  if (region && nation) return `${region}, ${nation}`
  else if (region) return region
  else if (nation) return nation
  return 'unknown'
}
export const files = (w: WorkshopBase) => w.files || []

/**
 * Formats a workshop object for consumption by salesforce
 */
export const toJSON = (w: WorkshopBase) => {
  const ret: Partial<WorkshopBase> = {
    Start_Date__c: w.Start_Date__c,
    End_Date__c: w.End_Date__c,
    Local_Start_Time__c: addMilliToTime(w.Local_Start_Time__c),
    Local_End_Time__c: addMilliToTime(w.Local_End_Time__c),
    Timezone__c: w.Timezone__c,
    Public__c: w.Public__c,
  }
  if (!isPortalCreated(w)) {
    ret.Id = w.Id
  }
  addIf(ret, 'Course_Manager__c', courseManagerId(w))
  addIf(ret, 'Event_City__c', w.Event_City__c)
  addIf(ret, 'Event_Country__c', w.Event_Country__c)
  addIf(ret, 'Host_Site__c', w.Host_Site__c)
  addIf(ret, 'Organizing_Affiliate__c', affiliateId(w))
  addIf(ret, 'Registration_Website__c', w.Registration_Website__c)
  addIf(ret, 'Status__c', w.Status__c)
  addIf(ret, 'Workshop_Type__c', w.Workshop_Type__c)
  addIf(ret, 'Billing_Contact__c', w.Billing_Contact__c)
  addIf(ret, 'Language__c', w.Language__c)
  addIf(ret, 'facilitators', w.facilitators)
  return ret
}

let idCounter = 0
export const ID_PREFIX = 'PORTAL_CREATED_WORKSHOP'

/**
 * Creates a new empty workshop object
 */
export const workshop = (init: Partial<WorkshopBase> = {}): WorkshopBase => {
  const base: WorkshopBase = {
    Id: `${ID_PREFIX}:${idCounter++}`,
    Start_Date__c: getIsoYMD(new Date()),
    End_Date__c: getIsoYMD(moment().add(1, 'd')),
    LastModifiedDate: getIsoYMD(new Date()),
    Local_Start_Time__c: '08:00:00.000Z',
    Local_End_Time__c: '17:00:00.000Z',
    Timezone__c: moment.tz.guess() as Timezone,
    get Start_Time__c() {
      return addTimeAndTz(
        this.Start_Date__c,
        formatTime(this.Local_Start_Time__c),
        this.Timezone__c,
      ).toISOString(true)
    },
    get End_Time__c() {
      return addTimeAndTz(
        this.Start_Date__c,
        formatTime(this.Local_End_Time__c),
        this.Timezone__c,
      ).toISOString(true)
    },
    Organizing_Affiliate__c: '',
    Public__c: false,
  }

  // when spread the getters turn into static properties, which is what we want
  return { ...base, ...init }
}

/* ================
 * SETTER FUNCTIONS
 * ================
 */

export const addInstructorsMut = (
  w: WorkshopBase,
  facs: ToReadonlyArray<Exclude<WorkshopBase['facilitators'], undefined>>,
) => {
  w.facilitators = [...new Set([...w.facilitators, ...facs])]
  return w
}

/* =================
 * UTILITY FUNCTIONS
 * =================
 */

export const isPortalCreated = (w: WorkshopBase) =>
  w.Id.startsWith(`${ID_PREFIX}:`)

/**
 * Adds the seconds and milliseconds section
 * to a time string for use by salesforce
 *
 * @param time a time string in the form HH:mm
 */
export const addMilliToTime = (time: string) => {
  if (time.charAt(time.length - 1) === 'Z') return time
  return formatTime(time) + ':00.000Z'
}

/**
 * Formats a time string for use in the website
 *
 * Removes the seconds and miliseconds section 00:00:00.000Z -> 00:00
 * @param time a time string in the form HH:mm:ss.000Z
 */
export const formatTime = (time: string) => {
  const replaced = time.replace(/:\d\d\.\d\d\dZ$/, '')
  const coloncount = Array.from(replaced).reduce(
    (p, c) => (c === ':' ? p + 1 : p),
    0,
  )
  if (coloncount > 1) {
    const lastcolon = replaced.lastIndexOf(':')
    return replaced.slice(0, lastcolon)
  }
  return replaced
}

/**
 * Creates a moment object from the passed date, time, and timezone
 * @param date a date object or a string in the form YYYY-MM-DD
 * @param time a time string in the form HH:mm
 * @param zone a timezone string
 */
export const addTimeAndTz = (
  date: Moment | Date | string,
  time: string,
  zone?: string,
  utc = false,
) => {
  const timeMoment = moment(time, 'HH:mm')
  const info =
    typeof date === 'string'
      ? `${date} ${time}`
      : ((d: Moment) => ({
          year: (utc ? d.utc() : d).year(),
          month: (utc ? d.utc() : d).month(),
          day: (utc ? d.utc() : d).date(),
          hour: timeMoment.get('hour'),
          minute: timeMoment.get('minute'),
        }))(date instanceof Date ? moment(date) : date)
  return typeof zone === 'undefined' ? moment(info) : moment.tz(info, zone)
}

function formatDate(d: string | number | Date | Moment) {
  try {
    if (!isMoment(d))
      // tslint:disable-next-line:no-parameter-reassignment
      d = moment(d)
    return d.format('DD MMM, YYYY')
  } catch (e) {
    return ''
  }
}
