import moment, { Moment, isMoment } from 'moment'
import { tz } from 'moment-timezone'
import { Affiliate } from '../affiliates/affiliate.model'
import { Facilitator } from '../facilitators/facilitator.model'
import { CourseManager } from './course-manager.model'
import { SFObject } from '../shared/models/sf-object.abstract.model'
import { tuple } from '../util/functional'
import { getIsoYMD } from '../util/util'

export type Timezone =
  | 'Africa/Abidjan'
  | 'Africa/Accra'
  | 'Africa/Addis_Ababa'
  | 'Africa/Algiers'
  | 'Africa/Asmara'
  | 'Africa/Asmera'
  | 'Africa/Bamako'
  | 'Africa/Bangui'
  | 'Africa/Banjul'
  | 'Africa/Bissau'
  | 'Africa/Blantyre'
  | 'Africa/Brazzaville'
  | 'Africa/Bujumbura'
  | 'Africa/Cairo'
  | 'Africa/Casablanca'
  | 'Africa/Ceuta'
  | 'Africa/Conakry'
  | 'Africa/Dakar'
  | 'Africa/Dar_es_Salaam'
  | 'Africa/Djibouti'
  | 'Africa/Douala'
  | 'Africa/El_Aaiun'
  | 'Africa/Freetown'
  | 'Africa/Gaborone'
  | 'Africa/Harare'
  | 'Africa/Johannesburg'
  | 'Africa/Juba'
  | 'Africa/Kampala'
  | 'Africa/Khartoum'
  | 'Africa/Kigali'
  | 'Africa/Kinshasa'
  | 'Africa/Lagos'
  | 'Africa/Libreville'
  | 'Africa/Lome'
  | 'Africa/Luanda'
  | 'Africa/Lubumbashi'
  | 'Africa/Lusaka'
  | 'Africa/Malabo'
  | 'Africa/Maputo'
  | 'Africa/Maseru'
  | 'Africa/Mbabane'
  | 'Africa/Mogadishu'
  | 'Africa/Monrovia'
  | 'Africa/Nairobi'
  | 'Africa/Ndjamena'
  | 'Africa/Niamey'
  | 'Africa/Nouakchott'
  | 'Africa/Ouagadougou'
  | 'Africa/Porto-Novo'
  | 'Africa/Sao_Tome'
  | 'Africa/Timbuktu'
  | 'Africa/Tripoli'
  | 'Africa/Tunis'
  | 'Africa/Windhoek'
  | 'America/Adak'
  | 'America/Anchorage'
  | 'America/Anguilla'
  | 'America/Antigua'
  | 'America/Araguaina'
  | 'America/Argentina/Buenos_Aires'
  | 'America/Argentina/Catamarca'
  | 'America/Argentina/ComodRivadavia'
  | 'America/Argentina/Cordoba'
  | 'America/Argentina/Jujuy'
  | 'America/Argentina/La_Rioja'
  | 'America/Argentina/Mendoza'
  | 'America/Argentina/Rio_Gallegos'
  | 'America/Argentina/Salta'
  | 'America/Argentina/San_Juan'
  | 'America/Argentina/San_Luis'
  | 'America/Argentina/Tucuman'
  | 'America/Argentina/Ushuaia'
  | 'America/Aruba'
  | 'America/Asuncion'
  | 'America/Atikokan'
  | 'America/Atka'
  | 'America/Bahia'
  | 'America/Bahia_Banderas'
  | 'America/Barbados'
  | 'America/Belem'
  | 'America/Belize'
  | 'America/Blanc-Sablon'
  | 'America/Boa_Vista'
  | 'America/Bogota'
  | 'America/Boise'
  | 'America/Buenos_Aires'
  | 'America/Cambridge_Bay'
  | 'America/Campo_Grande'
  | 'America/Cancun'
  | 'America/Caracas'
  | 'America/Catamarca'
  | 'America/Cayenne'
  | 'America/Cayman'
  | 'America/Chicago'
  | 'America/Chihuahua'
  | 'America/Coral_Harbour'
  | 'America/Cordoba'
  | 'America/Costa_Rica'
  | 'America/Creston'
  | 'America/Cuiaba'
  | 'America/Curacao'
  | 'America/Danmarkshavn'
  | 'America/Dawson'
  | 'America/Dawson_Creek'
  | 'America/Denver'
  | 'America/Detroit'
  | 'America/Dominica'
  | 'America/Edmonton'
  | 'America/Eirunepe'
  | 'America/El_Salvador'
  | 'America/Ensenada'
  | 'America/Fort_Nelson'
  | 'America/Fort_Wayne'
  | 'America/Fortaleza'
  | 'America/Glace_Bay'
  | 'America/Godthab'
  | 'America/Goose_Bay'
  | 'America/Grand_Turk'
  | 'America/Grenada'
  | 'America/Guadeloupe'
  | 'America/Guatemala'
  | 'America/Guayaquil'
  | 'America/Guyana'
  | 'America/Halifax'
  | 'America/Havana'
  | 'America/Hermosillo'
  | 'America/Indiana/Indianapolis'
  | 'America/Indiana/Knox'
  | 'America/Indiana/Marengo'
  | 'America/Indiana/Petersburg'
  | 'America/Indiana/Tell_City'
  | 'America/Indiana/Vevay'
  | 'America/Indiana/Vincennes'
  | 'America/Indiana/Winamac'
  | 'America/Indianapolis'
  | 'America/Inuvik'
  | 'America/Iqaluit'
  | 'America/Jamaica'
  | 'America/Jujuy'
  | 'America/Juneau'
  | 'America/Kentucky/Louisville'
  | 'America/Kentucky/Monticello'
  | 'America/Knox_IN'
  | 'America/Kralendijk'
  | 'America/La_Paz'
  | 'America/Lima'
  | 'America/Los_Angeles'
  | 'America/Louisville'
  | 'America/Lower_Princes'
  | 'America/Maceio'
  | 'America/Managua'
  | 'America/Manaus'
  | 'America/Marigot'
  | 'America/Martinique'
  | 'America/Matamoros'
  | 'America/Mazatlan'
  | 'America/Mendoza'
  | 'America/Menominee'
  | 'America/Merida'
  | 'America/Metlakatla'
  | 'America/Mexico_City'
  | 'America/Miquelon'
  | 'America/Moncton'
  | 'America/Monterrey'
  | 'America/Montevideo'
  | 'America/Montreal'
  | 'America/Montserrat'
  | 'America/Nassau'
  | 'America/New_York'
  | 'America/Nipigon'
  | 'America/Nome'
  | 'America/Noronha'
  | 'America/North_Dakota/Beulah'
  | 'America/North_Dakota/Center'
  | 'America/North_Dakota/New_Salem'
  | 'America/Ojinaga'
  | 'America/Panama'
  | 'America/Pangnirtung'
  | 'America/Paramaribo'
  | 'America/Phoenix'
  | 'America/Port-au-Prince'
  | 'America/Port_of_Spain'
  | 'America/Porto_Acre'
  | 'America/Porto_Velho'
  | 'America/Puerto_Rico'
  | 'America/Punta_Arenas'
  | 'America/Rainy_River'
  | 'America/Rankin_Inlet'
  | 'America/Recife'
  | 'America/Regina'
  | 'America/Resolute'
  | 'America/Rio_Branco'
  | 'America/Rosario'
  | 'America/Santa_Isabel'
  | 'America/Santarem'
  | 'America/Santiago'
  | 'America/Santo_Domingo'
  | 'America/Sao_Paulo'
  | 'America/Scoresbysund'
  | 'America/Shiprock'
  | 'America/Sitka'
  | 'America/St_Barthelemy'
  | 'America/St_Johns'
  | 'America/St_Kitts'
  | 'America/St_Lucia'
  | 'America/St_Thomas'
  | 'America/St_Vincent'
  | 'America/Swift_Current'
  | 'America/Tegucigalpa'
  | 'America/Thule'
  | 'America/Thunder_Bay'
  | 'America/Tijuana'
  | 'America/Toronto'
  | 'America/Tortola'
  | 'America/Vancouver'
  | 'America/Virgin'
  | 'America/Whitehorse'
  | 'America/Winnipeg'
  | 'America/Yakutat'
  | 'America/Yellowknife'
  | 'Antarctica/Casey'
  | 'Antarctica/Davis'
  | 'Antarctica/DumontDUrville'
  | 'Antarctica/Macquarie'
  | 'Antarctica/Mawson'
  | 'Antarctica/McMurdo'
  | 'Antarctica/Palmer'
  | 'Antarctica/Rothera'
  | 'Antarctica/South_Pole'
  | 'Antarctica/Syowa'
  | 'Antarctica/Troll'
  | 'Antarctica/Vostok'
  | 'Arctic/Longyearbyen'
  | 'Asia/Aden'
  | 'Asia/Almaty'
  | 'Asia/Amman'
  | 'Asia/Anadyr'
  | 'Asia/Aqtau'
  | 'Asia/Aqtobe'
  | 'Asia/Ashgabat'
  | 'Asia/Ashkhabad'
  | 'Asia/Atyrau'
  | 'Asia/Baghdad'
  | 'Asia/Bahrain'
  | 'Asia/Baku'
  | 'Asia/Bangkok'
  | 'Asia/Barnaul'
  | 'Asia/Beirut'
  | 'Asia/Bishkek'
  | 'Asia/Brunei'
  | 'Asia/Calcutta'
  | 'Asia/Chita'
  | 'Asia/Choibalsan'
  | 'Asia/Chongqing'
  | 'Asia/Chungking'
  | 'Asia/Colombo'
  | 'Asia/Dacca'
  | 'Asia/Damascus'
  | 'Asia/Dhaka'
  | 'Asia/Dili'
  | 'Asia/Dubai'
  | 'Asia/Dushanbe'
  | 'Asia/Famagusta'
  | 'Asia/Gaza'
  | 'Asia/Harbin'
  | 'Asia/Hebron'
  | 'Asia/Ho_Chi_Minh'
  | 'Asia/Hong_Kong'
  | 'Asia/Hovd'
  | 'Asia/Irkutsk'
  | 'Asia/Istanbul'
  | 'Asia/Jakarta'
  | 'Asia/Jayapura'
  | 'Asia/Jerusalem'
  | 'Asia/Kabul'
  | 'Asia/Kamchatka'
  | 'Asia/Karachi'
  | 'Asia/Kashgar'
  | 'Asia/Kathmandu'
  | 'Asia/Katmandu'
  | 'Asia/Khandyga'
  | 'Asia/Kolkata'
  | 'Asia/Krasnoyarsk'
  | 'Asia/Kuala_Lumpur'
  | 'Asia/Kuching'
  | 'Asia/Kuwait'
  | 'Asia/Macao'
  | 'Asia/Macau'
  | 'Asia/Magadan'
  | 'Asia/Makassar'
  | 'Asia/Manila'
  | 'Asia/Muscat'
  | 'Asia/Nicosia'
  | 'Asia/Novokuznetsk'
  | 'Asia/Novosibirsk'
  | 'Asia/Omsk'
  | 'Asia/Oral'
  | 'Asia/Phnom_Penh'
  | 'Asia/Pontianak'
  | 'Asia/Pyongyang'
  | 'Asia/Qatar'
  | 'Asia/Qyzylorda'
  | 'Asia/Rangoon'
  | 'Asia/Riyadh'
  | 'Asia/Saigon'
  | 'Asia/Sakhalin'
  | 'Asia/Samarkand'
  | 'Asia/Seoul'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Srednekolymsk'
  | 'Asia/Taipei'
  | 'Asia/Tashkent'
  | 'Asia/Tbilisi'
  | 'Asia/Tehran'
  | 'Asia/Tel_Aviv'
  | 'Asia/Thimbu'
  | 'Asia/Thimphu'
  | 'Asia/Tokyo'
  | 'Asia/Tomsk'
  | 'Asia/Ujung_Pandang'
  | 'Asia/Ulaanbaatar'
  | 'Asia/Ulan_Bator'
  | 'Asia/Urumqi'
  | 'Asia/Ust-Nera'
  | 'Asia/Vientiane'
  | 'Asia/Vladivostok'
  | 'Asia/Yakutsk'
  | 'Asia/Yangon'
  | 'Asia/Yekaterinburg'
  | 'Asia/Yerevan'
  | 'Atlantic/Azores'
  | 'Atlantic/Bermuda'
  | 'Atlantic/Canary'
  | 'Atlantic/Cape_Verde'
  | 'Atlantic/Faeroe'
  | 'Atlantic/Faroe'
  | 'Atlantic/Jan_Mayen'
  | 'Atlantic/Madeira'
  | 'Atlantic/Reykjavik'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/St_Helena'
  | 'Atlantic/Stanley'
  | 'Australia/ACT'
  | 'Australia/Adelaide'
  | 'Australia/Brisbane'
  | 'Australia/Broken_Hill'
  | 'Australia/Canberra'
  | 'Australia/Currie'
  | 'Australia/Darwin'
  | 'Australia/Eucla'
  | 'Australia/Hobart'
  | 'Australia/LHI'
  | 'Australia/Lindeman'
  | 'Australia/Lord_Howe'
  | 'Australia/Melbourne'
  | 'Australia/NSW'
  | 'Australia/North'
  | 'Australia/Perth'
  | 'Australia/Queensland'
  | 'Australia/South'
  | 'Australia/Sydney'
  | 'Australia/Tasmania'
  | 'Australia/Victoria'
  | 'Australia/West'
  | 'Australia/Yancowinna'
  | 'Brazil/Acre'
  | 'Brazil/DeNoronha'
  | 'Brazil/East'
  | 'Brazil/West'
  | 'CET'
  | 'CST6CDT'
  | 'Canada/Atlantic'
  | 'Canada/Central'
  | 'Canada/Eastern'
  | 'Canada/Mountain'
  | 'Canada/Newfoundland'
  | 'Canada/Pacific'
  | 'Canada/Saskatchewan'
  | 'Canada/Yukon'
  | 'Chile/Continental'
  | 'Chile/EasterIsland'
  | 'Cuba'
  | 'EET'
  | 'EST'
  | 'EST5EDT'
  | 'Egypt'
  | 'Eire'
  | 'Etc/GMT'
  | 'Etc/GMT+0'
  | 'Etc/GMT+1'
  | 'Etc/GMT+10'
  | 'Etc/GMT+11'
  | 'Etc/GMT+12'
  | 'Etc/GMT+2'
  | 'Etc/GMT+3'
  | 'Etc/GMT+4'
  | 'Etc/GMT+5'
  | 'Etc/GMT+6'
  | 'Etc/GMT+7'
  | 'Etc/GMT+8'
  | 'Etc/GMT+9'
  | 'Etc/GMT-0'
  | 'Etc/GMT-1'
  | 'Etc/GMT-10'
  | 'Etc/GMT-11'
  | 'Etc/GMT-12'
  | 'Etc/GMT-13'
  | 'Etc/GMT-14'
  | 'Etc/GMT-2'
  | 'Etc/GMT-3'
  | 'Etc/GMT-4'
  | 'Etc/GMT-5'
  | 'Etc/GMT-6'
  | 'Etc/GMT-7'
  | 'Etc/GMT-8'
  | 'Etc/GMT-9'
  | 'Etc/GMT0'
  | 'Etc/Greenwich'
  | 'Etc/UCT'
  | 'Etc/UTC'
  | 'Etc/Universal'
  | 'Etc/Zulu'
  | 'Europe/Amsterdam'
  | 'Europe/Andorra'
  | 'Europe/Astrakhan'
  | 'Europe/Athens'
  | 'Europe/Belfast'
  | 'Europe/Belgrade'
  | 'Europe/Berlin'
  | 'Europe/Bratislava'
  | 'Europe/Brussels'
  | 'Europe/Bucharest'
  | 'Europe/Budapest'
  | 'Europe/Busingen'
  | 'Europe/Chisinau'
  | 'Europe/Copenhagen'
  | 'Europe/Dublin'
  | 'Europe/Gibraltar'
  | 'Europe/Guernsey'
  | 'Europe/Helsinki'
  | 'Europe/Isle_of_Man'
  | 'Europe/Istanbul'
  | 'Europe/Jersey'
  | 'Europe/Kaliningrad'
  | 'Europe/Kiev'
  | 'Europe/Kirov'
  | 'Europe/Lisbon'
  | 'Europe/Ljubljana'
  | 'Europe/London'
  | 'Europe/Luxembourg'
  | 'Europe/Madrid'
  | 'Europe/Malta'
  | 'Europe/Mariehamn'
  | 'Europe/Minsk'
  | 'Europe/Monaco'
  | 'Europe/Moscow'
  | 'Europe/Nicosia'
  | 'Europe/Oslo'
  | 'Europe/Paris'
  | 'Europe/Podgorica'
  | 'Europe/Prague'
  | 'Europe/Riga'
  | 'Europe/Rome'
  | 'Europe/Samara'
  | 'Europe/San_Marino'
  | 'Europe/Sarajevo'
  | 'Europe/Saratov'
  | 'Europe/Simferopol'
  | 'Europe/Skopje'
  | 'Europe/Sofia'
  | 'Europe/Stockholm'
  | 'Europe/Tallinn'
  | 'Europe/Tirane'
  | 'Europe/Tiraspol'
  | 'Europe/Ulyanovsk'
  | 'Europe/Uzhgorod'
  | 'Europe/Vaduz'
  | 'Europe/Vatican'
  | 'Europe/Vienna'
  | 'Europe/Vilnius'
  | 'Europe/Volgograd'
  | 'Europe/Warsaw'
  | 'Europe/Zagreb'
  | 'Europe/Zaporozhye'
  | 'Europe/Zurich'
  | 'GB'
  | 'GB-Eire'
  | 'GMT'
  | 'GMT+0'
  | 'GMT-0'
  | 'GMT0'
  | 'Greenwich'
  | 'HST'
  | 'Hongkong'
  | 'Iceland'
  | 'Indian/Antananarivo'
  | 'Indian/Chagos'
  | 'Indian/Christmas'
  | 'Indian/Cocos'
  | 'Indian/Comoro'
  | 'Indian/Kerguelen'
  | 'Indian/Mahe'
  | 'Indian/Maldives'
  | 'Indian/Mauritius'
  | 'Indian/Mayotte'
  | 'Indian/Reunion'
  | 'Iran'
  | 'Israel'
  | 'Jamaica'
  | 'Japan'
  | 'Kwajalein'
  | 'Libya'
  | 'MET'
  | 'MST'
  | 'MST7MDT'
  | 'Mexico/BajaNorte'
  | 'Mexico/BajaSur'
  | 'Mexico/General'
  | 'NZ'
  | 'NZ-CHAT'
  | 'Navajo'
  | 'PRC'
  | 'PST8PDT'
  | 'Pacific/Apia'
  | 'Pacific/Auckland'
  | 'Pacific/Bougainville'
  | 'Pacific/Chatham'
  | 'Pacific/Chuuk'
  | 'Pacific/Easter'
  | 'Pacific/Efate'
  | 'Pacific/Enderbury'
  | 'Pacific/Fakaofo'
  | 'Pacific/Fiji'
  | 'Pacific/Funafuti'
  | 'Pacific/Galapagos'
  | 'Pacific/Gambier'
  | 'Pacific/Guadalcanal'
  | 'Pacific/Guam'
  | 'Pacific/Honolulu'
  | 'Pacific/Johnston'
  | 'Pacific/Kiritimati'
  | 'Pacific/Kosrae'
  | 'Pacific/Kwajalein'
  | 'Pacific/Majuro'
  | 'Pacific/Marquesas'
  | 'Pacific/Midway'
  | 'Pacific/Nauru'
  | 'Pacific/Niue'
  | 'Pacific/Norfolk'
  | 'Pacific/Noumea'
  | 'Pacific/Pago_Pago'
  | 'Pacific/Palau'
  | 'Pacific/Pitcairn'
  | 'Pacific/Pohnpei'
  | 'Pacific/Ponape'
  | 'Pacific/Port_Moresby'
  | 'Pacific/Rarotonga'
  | 'Pacific/Saipan'
  | 'Pacific/Samoa'
  | 'Pacific/Tahiti'
  | 'Pacific/Tarawa'
  | 'Pacific/Tongatapu'
  | 'Pacific/Truk'
  | 'Pacific/Wake'
  | 'Pacific/Wallis'
  | 'Pacific/Yap'
  | 'Poland'
  | 'Portugal'
  | 'ROC'
  | 'ROK'
  | 'Singapore'
  | 'Turkey'
  | 'UCT'
  | 'US/Alaska'
  | 'US/Aleutian'
  | 'US/Arizona'
  | 'US/Central'
  | 'US/East-Indiana'
  | 'US/Eastern'
  | 'US/Hawaii'
  | 'US/Indiana-Starke'
  | 'US/Michigan'
  | 'US/Mountain'
  | 'US/Pacific'
  | 'US/Pacific-New'
  | 'US/Samoa'
  | 'UTC'
  | 'Universal'
  | 'W-SU'
  | 'WET'
  | 'Zulu'

type m<T> = T | null | undefined
// tslint:disable-next-line:class-name
export interface Workshop__c {
  Id: string
  IsDeleted: boolean
  Name?: m<string>
  CreatedDate: string
  CreatedById: string
  CreatedBy: object
  LastModifiedDate: string
  LastModifiedById: string
  LastModifiedBy: object
  SystemModstamp: string
  LastViewedDate?: m<string>
  LastReferencedDate?: m<string>
  Billing_Contact__c?: m<string>
  Course_Manager__c?: m<string>
  Course_Manager__r?: m<object /*Contact*/>
  Event_City__c?: m<string>
  Event_Country__c?: m<string>
  Organizing_Affiliate__c: string
  Organizing_Affiliate__r: object /*Account*/
  Public__c: boolean
  Registration_Website__c?: m<string>
  End_Time__c: string
  Start_Time__c: string
  End_Date__c: string
  Start_Date__c: string
  Local_Start_Time__c: string
  Local_End_Time__c: string
  Timezone__c?: m<Timezone>
  Status__c?: m<
    | 'Proposed'
    | 'Verified'
    | 'Action Pending'
    | 'Ready To Be Invoiced'
    | 'Invoiced, Not Paid'
    | 'Archived'
    | 'Cancelled'
  >
  Workshop_Type__c?: m<'Discover' | 'Improve' | 'Enable' | 'Align' | 'Build'>
  Host_Site__c?: m<string>
  Language__c?: m<string>

  AttachedContentDocuments?: m<object[]>
  AttachedContentNotes?: m<object[]>
  Attachments?: m<object[]>
  CombinedAttachments?: m<object[]>
  ContentDocumentLinks?: m<object[]>
  DuplicateRecordItems?: m<object[]>
  Emails?: m<object[]>
  Notes?: m<object[]>
  NotesAndAttachments?: m<object[]>
  ProcessInstances?: m<object[]>
  ProcessSteps?: m<object[]>
  TopicAssignments?: m<object[]>
  Instructors__r?: m<object[] /*WorkshopFacilitatorAssociation__c[]*/>
  Attendees__r?: m<object[]>
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

export type WorkshopType = 'Discover' | 'Enable' | 'Improve' | 'Align' | 'Build'

export type WorkshopStatusType =
  | 'Proposed'
  | 'Verified'
  | 'Action Pending'
  | 'Ready To Be Invoiced'
  | 'Invoiced, Not Paid'
  | 'Archived'
  | 'Cancelled'

export const zones = tz.names()
export const zoneOffsetPairs = zones.map(z => tuple(z, tz(z).format('Z')))

const formatTime = (time: string) => {
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
 * @desc Defines the interface to work with Workshops. Also provides a 'Facade' of the Salesforce API Naming conventions.
 *
 * @export
 * @class Workshop
 */
export class Workshop extends SFObject {
  public static get CourseTypes(): WorkshopType[] {
    return ['Discover', 'Enable', 'Improve', 'Align', 'Build']
  }
  public static get WorkshopStatusTypes(): WorkshopStatusType[] {
    return [
      'Proposed',
      'Verified',
      'Action Pending',
      'Ready To Be Invoiced',
      'Invoiced, Not Paid',
      'Archived',
      'Cancelled',
    ]
  }

  public get name(): string {
    return `${this.type} @ ${this.startDateFormatted} - ${
      this.endDateFormatted
    } by ${this.affiliate.name}`
  }

  public get sfId(): string {
    return this.Id
  }

  public get startDate(): Moment | Date {
    return moment(this.Start_Date__c)
  }
  public set startDate(date: Moment | Date) {
    this.Start_Date__c = getIsoYMD(date)
  }
  get startDateTz(): Moment {
    return moment.tz(this.Start_Date__c, this.Timezone__c)
  }
  public get startDateFormatted(): string {
    return Workshop.formatDate(this.startDate)
  }

  public get endDate(): Moment | Date {
    return moment(this.End_Date__c)
  }
  public set endDate(date: Moment | Date) {
    this.End_Date__c = getIsoYMD(date)
  }
  get endDateTz(): Moment {
    return moment.tz(this.End_Date__c, this.Timezone__c)
  }
  public get endDateFormatted(): string {
    return Workshop.formatDate(this.endDate)
  }

  public get startTime(): Moment {
    return addTimeAndTz(
      this.Start_Date__c,
      this.Local_Start_Time__c,
      this.Timezone__c,
    )
  }
  get startTimeFormatted(): string {
    return this.startTime.format('HH:mm z')
  }
  get relStartTimeFormatted(): string {
    return this.startTime.tz(moment.tz.guess()).format('DD MMM, YYYY @ HH:mm')
  }

  public get endTime(): Moment {
    return addTimeAndTz(
      this.End_Date__c,
      this.Local_End_Time__c,
      this.Timezone__c,
    )
  }
  get endTimeFormatted(): string {
    return this.endTime.format('HH:mm z')
  }
  get relEndTimeFormatted(): string {
    return this.endTime.tz(moment.tz.guess()).format('DD MMM, YYYY @ HH:mm')
  }

  public get courseManager(): CourseManager {
    return this.Course_Manager__r
  }
  public set courseManager(cm: CourseManager) {
    this.Course_Manager__r = cm
  }

  public get courseManagerId(): string {
    return this.Course_Manager__r
      ? this.Course_Manager__r.sfId
      : this.Course_Manager__c
  }

  public get instructors(): Facilitator[] {
    return this.facilitators
  }

  public get city(): string {
    return this.Event_City__c
  }
  public set city(city: string) {
    this.Event_City__c = city
  }

  public get country(): string {
    return this.Event_Country__c
  }
  public set country(country: string) {
    this.Event_Country__c = country
  }

  public get hostSite(): string {
    return this.Host_Site__c
  }
  public set hostSite(site: string) {
    this.Host_Site__c = site
  }

  public get affiliate(): Affiliate {
    return this.Organizing_Affiliate__r
  }
  public set affiliate(affiliate: Affiliate) {
    this.Organizing_Affiliate__r = affiliate
  }

  public get affiliateId(): string {
    return this.Organizing_Affiliate__c || this.Organizing_Affiliate__r.sfId
  }
  public set affiliateId(id: string) {
    this.Organizing_Affiliate__c = id
  }

  public get isPublic(): boolean {
    return this.Public__c
  }
  public set isPublic(isPublic: boolean) {
    this.Public__c = isPublic
  }

  public get website(): string {
    return this.Registration_Website__c
  }
  public set website(website: string) {
    this.Registration_Website__c = website
  }

  public get status(): WorkshopStatusType {
    return this.Status__c
  }
  public set status(status: WorkshopStatusType) {
    this.Status__c = status
  }

  public get type(): WorkshopType {
    return this.Workshop_Type__c
  }
  public set type(type: WorkshopType) {
    this.Workshop_Type__c = type
  }

  public get billing(): string {
    return this.Billing_Contact__c
  }
  public set billing(email: string) {
    this.Billing_Contact__c = email
  }

  public get language(): string {
    return this.Language__c
  }
  public set language(langauge: string) {
    this.Language__c = langauge
  }

  public get image(): string {
    switch (this.Workshop_Type__c.toLowerCase()) {
      case 'improve':
        return 'assets/imgs/shingo/Improve.png'
      case 'discover':
        return 'assets/imgs/shingo/Discover.png'
      case 'build':
        return 'assets/imgs/shingo/Build.png'
      case 'align':
        return 'assets/imgs/shingo/Align.png'
      case 'enable':
        return 'assets/imgs/shingo/Enable.png'
      default:
        return ''
    }
  }
  public get isVerified(): boolean {
    return this.Status__c.toLowerCase() !== 'proposed'
  }
  public get dueDate(): string {
    // due 7 days from the endDate
    const dueDate = this.endDate.valueOf() + 1000 * 60 * 60 * 24 * 7
    return Workshop.formatDate(dueDate)
  }
  public get location(): string {
    return `${this.city}, ${this.country}`
  }
  public files: Array<{
    Name: string
    ContentType: string
    BodyLength: number
  }> = []

  // public members
  /* tslint:disable:variable-name */
  public Id = ''
  public Start_Date__c = moment().format('YYYY-MM-DD')
  public End_Date__c = moment(Date.now() + 1000 * 60 * 60 * 24).format(
    'YYYY-MM-DD',
  ) // end date starts 1 day from the current time
  public Local_Start_Time__c = '08:00:00'
  public Local_End_Time__c = '17:00:00'
  public Timezone__c: Timezone = moment.tz.guess() as Timezone
  public Course_Manager__r: CourseManager = new CourseManager()
  public Course_Manager__c = ''
  public facilitators: Facilitator[] = []
  public Event_City__c = ''
  public Event_Country__c = ''
  public Host_Site__c = ''
  public Organizing_Affiliate__c = ''
  public Organizing_Affiliate__r: Affiliate = new Affiliate()
  public Public__c = false
  public Registration_Website__c = ''
  public Status__c: WorkshopStatusType = 'Proposed'
  public Workshop_Type__c: WorkshopType = 'Discover'
  public Billing_Contact__c = ''
  public Language__c = 'English'
  public Case_Study__c?: string
  /* tslint:enable:variable-name */

  // Be careful because Object.assign will assign variables dynamically: eg
  //  new Workshop({Id: 'some id', otherProp: 42}) => {Id: 'some id', otherProp: 42} that has type Workshop
  constructor(workshop?: Workshop__c & { facilitators: any[] }) {
    super()
    if (workshop) {
      Object.assign(this, workshop)
      // existing workshops will not have Local_{Start,End}_Time__c or Timezone__c defined
      // until we go back and retroactively fill them in salesforce, we will have this null check
      if (!this.Timezone__c) this.Timezone__c = 'Etc/UTC'
      this.Local_Start_Time__c = formatTime(
        this.Local_Start_Time__c || '08:00:00.000Z',
      )
      this.Local_End_Time__c = formatTime(
        this.Local_End_Time__c || '17:00:00.000Z',
      )
      this.Organizing_Affiliate__r = new Affiliate(
        workshop.Organizing_Affiliate__r,
      )
      this.Course_Manager__r = new CourseManager(workshop.Course_Manager__r)
      if (workshop.facilitators && workshop.facilitators instanceof Array) {
        this.facilitators = workshop.facilitators.map(
          fac => new Facilitator(fac),
        )
      }
    }
  }

  public static formatDate(d: string | number | Date | Moment) {
    try {
      if (!isMoment(d))
        // tslint:disable-next-line:no-parameter-reassignment
        d = moment(d)
      return d.format('DD MMM, YYYY')
    } catch (e) {
      return ''
    }
  }

  // Public "setter" for instructors
  public addInstructor(...facilitator: Facilitator[]): void {
    const filtered = facilitator.filter(
      f => !this.facilitators.find(fac => fac.Id === f.sfId),
    )
    this.facilitators.push(...filtered)
  }
  public removeInstructorById(sfId: string): void {
    this.facilitators = this.facilitators.filter(f => f['Id'] !== sfId)
  }
  public removeInstructorByIndex(index: number): void {
    this.facilitators.splice(index, 1)
  }

  // Utility methods
  public toJSON() {
    return {
      Id: this.sfId,
      Start_Date__c: this.Start_Date__c,
      End_Date__c: this.End_Date__c,
      Local_Start_Time__c: this.Local_Start_Time__c + ':00.000Z',
      Local_End_Time__c: this.Local_End_Time__c + ':00.000Z',
      Timezone__c: this.Timezone__c,
      Course_Manager__c: this.courseManagerId,
      Event_City__c: this.city,
      Event_Country__c: this.country,
      Host_Site__c: this.hostSite,
      Organizing_Affiliate__c: this.affiliateId,
      Public__c: this.isPublic,
      Registration_Website__c: this.website,
      Status__c: this.status,
      Workshop_Type__c: this.type,
      Billing_Contact__c: this.billing,
      Language__c: this.language,
      Case_Study__c: this.Case_Study__c,
      facilitators: this.instructors,
    }
  }
}
