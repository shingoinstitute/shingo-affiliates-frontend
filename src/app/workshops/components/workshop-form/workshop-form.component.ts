// Angular Modules
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  ValidatorFn,
} from '@angular/forms'

// App Modules
import { AuthService } from '~app/services/auth/auth.service'
import {
  CountriesService,
  CountryItem,
} from '~app/services/countries/countries.service'
import { FacilitatorService } from '~app/services/facilitator/facilitator.service'
import {
  AffiliateService,
  DEFAULT_AFFILIATE_SEARCH_FIELDS,
} from '~app/services/affiliate/affiliate.service'
import { WorkshopService } from '~app/services/workshop/workshop.service'
import {
  Workshop,
  WorkshopType,
  WorkshopStatusType,
  addTimeAndTz,
  Timezone,
} from '../../workshop.model'
import { CourseManager } from '../../course-manager.model'
import { Facilitator } from '~app/facilitators/facilitator.model'
import { Affiliate } from '~app/affiliates/affiliate.model'

// RxJS Modules
import { Observable, of } from 'rxjs'

// RxJS operators

import { CustomValidators } from 'ng2-validation'
import { LocaleService } from '~app/services/locale/locale.service'
import { mergeMap, map, startWith } from 'rxjs/operators'
import { tz, Moment } from 'moment-timezone'
import {
  normalizeString,
  getFormValidationErrors,
  getIsoYMD,
  withoutTime,
} from '~app/util/util'
import { Overwrite } from '~app/util/types'
import moment, { isMoment } from 'moment'
import { eq, lte, lt, gte, gt } from '~app/util/functional'

export interface WorkshopForm {
  affiliate: Affiliate
  timezone: Timezone
  times: { startTime: string; endTime: string }
  type: WorkshopType
  status?: WorkshopStatusType
  language: string
  isPublic: boolean
  city: string
  country: string
  hostSite: string
  courseManager: CourseManager
  dates: {
    startDate: string
    endDate: string
  }
  website?: string
  billing: string
  instructors: Facilitator[]
}

export const addToWorkshop = (
  form: WorkshopForm,
  workshop = new Workshop(),
): Workshop => {
  workshop.affiliate = form.affiliate
  workshop.type = form.type
  if (form.status) {
    workshop.status = form.status
  }
  workshop.language = form.language
  workshop.isPublic = form.isPublic
  workshop.city = form.city
  workshop.country = form.country
  workshop.hostSite = form.hostSite
  workshop.courseManager = form.courseManager
  workshop.Start_Date__c = form.dates.startDate
  workshop.End_Date__c = form.dates.endDate
  workshop.Local_Start_Time__c = form.times.startTime
  workshop.Local_End_Time__c = form.times.endTime
  workshop.Timezone__c = form.timezone

  if (form.website) {
    workshop.website = form.website
  }
  workshop.billing = form.billing
  workshop.addInstructor(...form.instructors)
  return workshop
}

const TimeValidator: ValidatorFn = control => {
  const errors = Validators.pattern(/^\d\d:\d\d(:\d\d)?$/)(control)
  return !errors ? errors : { time: true }
}

type TimeRangeInput = Date | Moment | number | false | '' | null | undefined

/**
 * Validates that a point in time occurs before or after the specified point
 * @param otherDate the other point in time
 * @param mode should the validated point occur before or after the other point?
 * @param allowEqual if mode is before or after, allow equal points to be valid
 */
const TimeRangeValidator = (
  otherDate: TimeRangeInput | (() => TimeRangeInput),
  mode: 'before' | 'after' | 'equal' = 'after',
  allowEqual = true,
  mapControlFn?: (value: unknown) => TimeRangeInput,
): ValidatorFn => control => {
  const value: TimeRangeInput =
    typeof mapControlFn !== 'undefined'
      ? mapControlFn(control.value)
      : control.value

  if (!value && value !== 0) return null

  const other = typeof otherDate === 'function' ? otherDate() : otherDate
  if (!other && other !== 0) return null

  const otherMilli = other.valueOf()
  const valueMilli = value.valueOf()

  const isValidFn =
    mode === 'equal'
      ? eq
      : mode === 'before'
        ? allowEqual
          ? lte
          : lt
        : allowEqual
          ? gte
          : gt

  const valid = isValidFn(valueMilli, otherMilli)

  return valid ? null : { 'time-range': mode }
}

@Component({
  selector: 'app-workshop-form',
  templateUrl: './workshop-form.component.html',
  styleUrls: ['./workshop-form.component.scss'],
})
export class WorkshopFormComponent implements OnInit {
  private _initialWorkshop?: Workshop
  // tslint:disable-next-line:no-input-rename
  @Input('workshop')
  set initialWorkshop(ws: Workshop | undefined) {
    this._initialWorkshop = ws
    if (this.workshopForm && ws) {
      this.workshopForm.controls['status'].setValidators(Validators.required)
    } else if (this.workshopForm) {
      this.workshopForm.controls['status'].clearValidators()
    }
  }
  get initialWorkshop() {
    return this._initialWorkshop
  }
  get isNewWorkshop() {
    return typeof this.initialWorkshop === 'undefined'
  }
  // tslint:disable-next-line:no-input-rename
  @Input()
  pending = false
  @Output()
  submitted = new EventEmitter<WorkshopForm>()

  get dateFormGroup(): FormGroup {
    return this.workshopForm.get('dates') as FormGroup
  }

  get timeFormGroup(): FormGroup {
    return this.workshopForm.controls['times'] as FormGroup
  }

  countryOptions$: Observable<
    Array<{ name: string; translations: Record<string, string> }>
  > = of([])
  workshopForm!: FormGroup
  countryFilterControl = new FormControl()
  languageFilterControl = new FormControl()
  tzFilterControl = new FormControl()
  tzPickerControl = new FormControl()
  describe: any = {}
  private timezones = tz.names()
  tzOptions$: Observable<string[]> = of([])

  workshopTypes: string[] = ['Discover', 'Enable', 'Improve', 'Align', 'Build']
  languages$: Observable<string[]> = of(Affiliate.DEFAULT_LANGUAGE_OPTIONS)
  statuses: string[] = [
    'Invoiced, Not Paid',
    'Finished, waiting for attendee list',
    'Awaiting Invoice',
    'Proposed',
    'Archived',
    'Cancelled',
    'Active, not ready for app',
    'Active Event',
  ]

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private _cs: CountriesService,
    private locale: LocaleService,
    private _fs: FacilitatorService,
    private _as: AffiliateService,
    private _ws: WorkshopService,
  ) {}

  facilitatorSearch = (query: string) => this._fs.search(query)
  courseManagerSearch = (query: string) =>
    this._as.searchCMS(query, this.getAffiliateId())
  affiliateSearch = (query: string) =>
    this._as.search(query, DEFAULT_AFFILIATE_SEARCH_FIELDS)

  ngOnInit() {
    this.createForm()
    this.subscribeToCountry()
    this.subscribeToIsPublic()
    this.getWorkshopDescription()
    this.languages$ = this.languageFilterControl.valueChanges.pipe(
      startWith(''),
      map((v: any) => (typeof v === 'string' ? v : (v && String(v)) || '')),
      map(value =>
        Affiliate.DEFAULT_LANGUAGE_OPTIONS.filter(l =>
          normalizeString(l)
            .toLocaleLowerCase()
            .includes(normalizeString(value).toLocaleLowerCase()),
        ),
      ),
    )
    this.tzOptions$ = this.tzFilterControl.valueChanges.pipe(
      startWith(''),
      map((v: any) => (typeof v === 'string' ? v : (v && String(v)) || '')),
      map(value =>
        this.timezones.filter(tz =>
          tz.toLowerCase().includes(value.toLowerCase()),
        ),
      ),
    )
  }

  /**
   * @description Retrieves a list of countries from {@link CountriesService} to pick from for the eventCountry FormControl.
   * Listens to value changes of the country FormControl and displays filtered results in the auto-complete.
   */
  private subscribeToCountry() {
    const countryList = this._cs.get()
    this.countryOptions$ = this.countryFilterControl.valueChanges.pipe(
      startWith(''),
      map((v: any) => (typeof v === 'string' ? v : (v && String(v)) || '')),
      mergeMap(value =>
        countryList.pipe(
          map(countries => {
            return countries.filter(v =>
              normalizeString(
                this.getLocalizedName(v).toLocaleLowerCase(),
              ).includes(normalizeString(value.toLocaleLowerCase())),
            )
          }),
        ),
      ),
    )
  }

  private subscribeToIsPublic() {
    const publicChanges$ = this.workshopForm.controls.isPublic.valueChanges
    publicChanges$.subscribe(isPublic => {
      const websiteControl = this.workshopForm.controls.website

      if (isPublic) {
        websiteControl.setValidators([
          Validators.required,
          CustomValidators.url,
        ])
      } else {
        websiteControl.clearValidators()
      }

      websiteControl.setValue('https://')
      websiteControl.updateValueAndValidity()
    })
  }

  /**
   * @description Gets an object (`this.describe`) from the api that is used to set helper text, labels, and picklist values
   */
  private getWorkshopDescription() {
    this._ws.describe().subscribe(
      data => {
        this.describe = data
        this.getWorkshopTypes()
        this.getWorkshopStatuses()
      },
      err => {
        console.error(err)
      },
    )
  }

  getLocalizedName(item: CountryItem) {
    const subtag = this.locale.primarySubtag
    return item.translations[subtag] || item.name
  }

  private createForm() {
    const startTime =
      (this.initialWorkshop && this.initialWorkshop.Local_Start_Time__c) ||
      '08:00'
    const endTime =
      (this.initialWorkshop && this.initialWorkshop.Local_End_Time__c) ||
      '17:00'
    const affiliate = this.initialWorkshop && this.initialWorkshop.affiliate
    const timezone =
      (this.initialWorkshop && this.initialWorkshop.Timezone__c) ||
      moment.tz.guess()

    const formgroupConfig: { [k in keyof WorkshopForm]: any } = {
      affiliate: [affiliate, Validators.required],
      type: [
        (this.initialWorkshop && this.initialWorkshop.type) || 'Discover',
        Validators.required,
      ],
      status: [
        this.initialWorkshop && this.initialWorkshop.status,
        ...(!this.isNewWorkshop ? [Validators.required] : []),
      ],
      language: [
        (this.initialWorkshop && this.initialWorkshop.language) || 'English',
        Validators.required,
      ],
      isPublic: [
        (this.initialWorkshop && this.initialWorkshop.isPublic) || false,
        Validators.required,
      ],
      city: [
        this.initialWorkshop && this.initialWorkshop.city,
        Validators.required,
      ],
      country: [
        this.initialWorkshop && this.initialWorkshop.country,
        Validators.required,
      ],
      hostSite: [
        this.initialWorkshop && this.initialWorkshop.hostSite,
        Validators.required,
      ],
      courseManager: [
        this.initialWorkshop && this.initialWorkshop.courseManager,
        Validators.required,
      ],
      dates: this.fb.group({
        startDate: [
          (this.initialWorkshop && this.initialWorkshop.startDate) || moment(),
          [
            Validators.required,
            TimeRangeValidator(
              () =>
                this.workshopForm &&
                withoutTime(this.dateFormGroup.controls['endDate'].value),
              'before',
              true,
              (v: unknown) =>
                isMoment(v) || v instanceof Date ? withoutTime(v) : null,
            ),
          ],
        ],
        endDate: [
          (this.initialWorkshop && this.initialWorkshop.endDate) ||
            moment().add(1, 'd'),
          Validators.required,
        ],
      }),
      times: this.fb.group({
        startTime: [
          startTime,
          [
            Validators.required,
            TimeValidator,
            TimeRangeValidator(
              () =>
                this.workshopForm &&
                this.dateFormGroup.controls.endDate.value &&
                this.timeFormGroup.controls.endTime.value &&
                addTimeAndTz(
                  this.dateFormGroup.controls.endDate.value,
                  this.timeFormGroup.controls.endTime.value,
                ),
              'before',
              true,
              v =>
                this.workshopForm &&
                this.dateFormGroup.controls.startDate.value &&
                this.dateFormGroup.controls.endDate.value &&
                withoutTime(
                  this.dateFormGroup.controls.startDate.value,
                ).valueOf() ===
                  withoutTime(
                    this.dateFormGroup.controls.endDate.value,
                  ).valueOf() &&
                typeof v === 'string' &&
                v &&
                addTimeAndTz(this.dateFormGroup.controls.startDate.value, v),
            ),
          ],
        ],
        endTime: [endTime, [Validators.required, TimeValidator]],
      }),
      timezone: [timezone, Validators.required],
      website: [this.initialWorkshop && this.initialWorkshop.website],
      billing: [
        this.initialWorkshop && this.initialWorkshop.billing,
        [Validators.required, Validators.email],
      ],
      instructors: [
        this.initialWorkshop && this.initialWorkshop.instructors,
        Validators.required,
      ],
    }

    this.workshopForm = this.fb.group(formgroupConfig)

    if (!affiliate && !(this.auth.user && this.auth.user.isAdmin)) {
      this.getAffiliate()
        .toPromise()
        .then(aff => {
          this.workshopForm.controls['affiliate'].setValue(aff)
        })
    }

    this.workshopForm.controls.timezone.valueChanges
      .pipe(startWith(timezone))
      .subscribe(v => {
        this.tzPickerControl.setValue(v, { onlySelf: true, emitEvent: false })
      })

    const dateControls = [
      this.dateFormGroup.controls.startDate,
      this.dateFormGroup.controls.endDate,
    ]
    // when any date changes, start time and start date both
    // have validators that need to be rechecked
    dateControls.forEach(c => {
      c.valueChanges.subscribe(() => {
        // we don't need to recheck startDate if startDate is the one that changed
        const recheck =
          c === this.dateFormGroup.controls.startDate
            ? [this.timeFormGroup.controls.startTime]
            : [
                this.dateFormGroup.controls.startDate,
                this.timeFormGroup.controls.startTime,
              ]
        recheck.forEach(o => o.updateValueAndValidity({ emitEvent: false }))
      })
    })

    // when the end time changes, start time validator must be rechecked
    this.timeFormGroup.controls.endTime.valueChanges.subscribe(() => {
      this.timeFormGroup.controls.startTime.updateValueAndValidity({
        emitEvent: false,
      })
    })

    this.tzPickerControl.valueChanges.subscribe(v => {
      ;(this.workshopForm.controls.timezone as FormControl).setValue(v)
    })
  }

  onSubmit() {
    if (!this.auth.user) return
    const value = this.workshopForm.value as Overwrite<
      WorkshopForm,
      {
        dates: {
          startDate: Moment | Date
          endDate: Moment | Date
        }
      }
    >
    const stringified: WorkshopForm = {
      ...value,
      dates: {
        startDate: getIsoYMD(value.dates.startDate),
        endDate: getIsoYMD(value.dates.endDate),
      },
    }
    this.submitted.emit(stringified)
  }

  contactDisplayWith = (value: null | undefined | { name: string }) =>
    value ? value.name : ''

  private getAffiliate(): Observable<Affiliate> {
    if (!this.auth.user) {
      throw new Error(
        'Dont know how this happened, but the user is not logged in',
      )
    }
    if (this.workshopForm.controls['affiliate'].value) {
      return of(this.workshopForm.controls['affiliate'].value as Affiliate)
    }
    return this._as.getById(this.auth.user.affiliate)
  }

  private getAffiliateId(): string {
    if (!this.auth.user) {
      throw new Error(
        'Dont know how this happened, but the user is not logged in',
      )
    }
    if (this.workshopForm.value.affiliate)
      return (this.workshopForm.value.affiliate as Affiliate).sfId
    else return this.auth.user.affiliate
  }

  getFormErrors = getFormValidationErrors

  /**
   * @description Sets value for `this.workshopTypes` from `this.describe`, or sets a default value if `this.describe` is null.
   */
  private getWorkshopTypes() {
    try {
      this.workshopTypes = this.describe.workshopType.picklistValues.map(
        (option: { label: string }) => option.label,
      )
    } catch (e) {
      console.warn(
        'Failed to get workshop types from `this.describe.workshopType.picklistValues`. Using default values.',
      )
    }
  }

  private getWorkshopStatuses() {
    try {
      this.statuses = this.describe.status.picklistValues.map(
        (option: { label: string }) => option.label,
      )
    } catch (e) {
      console.warn(
        'Failed to get workshop statuses from `this.describe.status.picklistValues`. Using default values.',
        this.describe,
      )
    }
  }
}
