// Angular Modules
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'

// App Modules
import {
  CountriesService,
  CountryItem,
} from '~app/services/countries/countries.service'
import { FacilitatorService } from '~app/services/facilitator/facilitator.service'
import {
  AffiliateService,
  DEFAULT_AFFILIATE_SEARCH_FIELDS,
} from '~app/services/affiliate/affiliate.service'
import * as W from '../../workshop.model'
// tslint:disable-next-line:no-duplicate-imports
import {
  WorkshopType,
  WorkshopStatusType,
  addTimeAndTz,
  Timezone,
  WorkshopBase,
} from '../../workshop.model'
import { CourseManager } from '../../course-manager.model'
import { Facilitator } from '~app/facilitators/facilitator.model'
import { Affiliate } from '~app/affiliates/affiliate.model'
import * as fromRoot from '~app/reducers'
import * as fromUser from '~app/user/reducers'
import { Store, select } from '@ngrx/store'

// RxJS Modules
import { Observable, of, EMPTY, combineLatest } from 'rxjs'

import { CustomValidators } from 'ng2-validation'
import { LocaleService } from '~app/services/locale/locale.service'
import {
  mergeMap,
  map,
  startWith,
  first,
  filter,
  catchError,
} from 'rxjs/operators'
import { tz, Moment } from 'moment-timezone'
import {
  normalizeString,
  getFormValidationErrors,
  getIsoYMD,
  withoutTime,
  addIf,
  getDescribes,
} from '~app/util/util'
import { Overwrite } from '~app/util/types'
import moment, { isMoment } from 'moment'
import produce from 'immer'
import { TimeRangeValidator } from '~app/shared/validators/time-range.validator'
import { TimeValidator } from '~app/shared/validators/time.validator'
import { affiliateId, User } from '~app/user/user.model'
import { WorkshopService } from '~app/workshops/services/workshop.service'
import { isTruthy } from '~app/util/predicates'
import { property } from '~app/util/functional'

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
  workshop = W.workshop(),
): WorkshopBase => {
  return produce(workshop, ws => {
    addIf(ws, 'Organizing_Affiliate__r', form.affiliate)
    addIf(ws, 'Organizing_Affiliate__c', form.affiliate && form.affiliate.Id)
    addIf(ws, 'Workshop_Type__c', form.type)
    addIf(ws, 'Status__c', form.status)
    addIf(ws, 'Language__c', form.language)
    addIf(ws, 'Public__c', form.isPublic)
    addIf(ws, 'Event_City__c', form.city)
    addIf(ws, 'Event_Country__c', form.country)
    addIf(ws, 'Host_Site__c', form.hostSite)
    addIf(ws, 'Course_Manager__r', form.courseManager)
    addIf(ws, 'Course_Manager__c', form.courseManager && form.courseManager.Id)
    addIf(ws, 'Start_Date__c', form.dates.startDate)
    addIf(ws, 'End_Date__c', form.dates.endDate)
    addIf(ws, 'Local_Start_Time__c', W.addMilliToTime(form.times.startTime))
    addIf(ws, 'Local_End_Time__c', W.addMilliToTime(form.times.endTime))
    addIf(ws, 'Timezone__c', form.timezone)
    addIf(ws, 'Registration_Website__c', form.website)
    addIf(ws, 'Billing_Contact__c', form.billing)
    if (form.instructors && form.instructors.length > 0) {
      W.addInstructorsMut(ws, form.instructors as any)
    }
  })
}

const defaultTypes = ['Discover', 'Enable', 'Improve', 'Align', 'Build']
const defaultStatuses = [
  'Invoiced, Not Paid',
  'Finished, waiting for attendee list',
  'Awaiting Invoice',
  'Proposed',
  'Archived',
  'Cancelled',
  'Active, not ready for app',
  'Active Event',
]

@Component({
  selector: 'app-workshop-form',
  templateUrl: './workshop-form.component.html',
  styleUrls: ['./workshop-form.component.scss'],
})
export class WorkshopFormComponent implements OnInit {
  private _initialWorkshop?: WorkshopBase
  // tslint:disable-next-line:no-input-rename
  @Input('workshop')
  set initialWorkshop(ws: WorkshopBase | undefined) {
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
  private timezones = tz.names()
  tzOptions$: Observable<string[]> = of([])
  describe$: Observable<{
    workshopTypes: string[]
    describe: ReturnType<typeof getDescribes>
    statuses: string[]
  }> = EMPTY

  languages$: Observable<string[]> = of(Affiliate.DEFAULT_LANGUAGE_OPTIONS)

  isAdmin$: Observable<boolean>
  private user$: Observable<User | null>

  constructor(
    private fb: FormBuilder,
    private _cs: CountriesService,
    private locale: LocaleService,
    private _fs: FacilitatorService,
    private _as: AffiliateService,
    private _ws: WorkshopService,
    store: Store<fromRoot.State>,
  ) {
    this.isAdmin$ = store.pipe(select(fromUser.isAdmin))
    this.user$ = store.pipe(select(fromUser.getUser))
  }

  facilitatorSearch = (query: string) => this._fs.search(query)
  courseManagerSearch = (query: string) =>
    this.getAffiliateId$().pipe(mergeMap(id => this._as.searchCMS(query, id)))
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
    type Ret = ReturnType<typeof getDescribes>
    const describes$ = this._ws.describeCached().pipe(
      map(getDescribes),
      catchError(() => of({} as Ret)),
      startWith({} as Ret),
    )
    const workshopTypes$ = describes$.pipe(
      map(d => {
        const wsType = d.workshopType
        const values = wsType && wsType.picklistValues

        return values && values.length > 0
          ? values.map(property('label')).filter(isTruthy)
          : defaultTypes
      }),
      startWith(defaultTypes),
    )
    const statuses$ = describes$.pipe(
      map(d => {
        const wsStatus = d.status
        const values = wsStatus && wsStatus.picklistValues

        return values && values.length > 0
          ? values.map(property('label')).filter(isTruthy)
          : defaultStatuses
      }),
      startWith(defaultStatuses),
    )

    this.describe$ = combineLatest(describes$, workshopTypes$, statuses$).pipe(
      map(([describe, workshopTypes, statuses]) => ({
        describe,
        workshopTypes,
        statuses,
      })),
    )
  }

  getLocalizedName(item: CountryItem) {
    const subtag = this.locale.primarySubtag
    return item.translations[subtag] || item.name
  }

  private createForm() {
    const startTime =
      (this.initialWorkshop && W.localStartTime(this.initialWorkshop)) ||
      '08:00'
    const endTime =
      (this.initialWorkshop && W.localEndTime(this.initialWorkshop)) || '17:00'
    const affiliate = this.initialWorkshop && W.affiliate(this.initialWorkshop)
    const timezone =
      (this.initialWorkshop && this.initialWorkshop.Timezone__c) ||
      moment.tz.guess()

    const formgroupConfig: { [k in keyof WorkshopForm]: any } = {
      affiliate: [affiliate, Validators.required],
      type: [
        (this.initialWorkshop && W.type(this.initialWorkshop)) || 'Discover',
        Validators.required,
      ],
      status: [
        this.initialWorkshop && W.status(this.initialWorkshop),
        ...(!this.isNewWorkshop ? [Validators.required] : []),
      ],
      language: [
        (this.initialWorkshop && W.language(this.initialWorkshop)) || 'English',
        Validators.required,
      ],
      isPublic: [
        (this.initialWorkshop && this.initialWorkshop.Public__c) || false,
        Validators.required,
      ],
      city: [
        this.initialWorkshop && W.city(this.initialWorkshop),
        Validators.required,
      ],
      country: [
        this.initialWorkshop && W.country(this.initialWorkshop),
        Validators.required,
      ],
      hostSite: [
        this.initialWorkshop && W.hostSite(this.initialWorkshop),
        Validators.required,
      ],
      courseManager: [
        this.initialWorkshop && W.courseManager(this.initialWorkshop),
        Validators.required,
      ],
      dates: this.fb.group({
        startDate: [
          (this.initialWorkshop && W.startDate(this.initialWorkshop)) ||
            moment(),
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
          (this.initialWorkshop && W.endDate(this.initialWorkshop)) ||
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
      website: [this.initialWorkshop && W.website(this.initialWorkshop)],
      billing: [
        this.initialWorkshop && W.billing(this.initialWorkshop),
        [Validators.required, Validators.email],
      ],
      instructors: [
        this.initialWorkshop && W.instructors(this.initialWorkshop),
        Validators.required,
      ],
    }

    this.workshopForm = this.fb.group(formgroupConfig)

    if (!affiliate) {
      this.isAdmin$.pipe(first()).subscribe(isAdmin => {
        if (!isAdmin) {
          this.getAffiliate$()
            .toPromise()
            .then(aff => {
              this.workshopForm.controls['affiliate'].setValue(aff)
            })
        }
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

  private getAffiliate$(): Observable<Affiliate> {
    if (this.workshopForm.controls['affiliate'].value) {
      return of(this.workshopForm.controls['affiliate'].value as Affiliate)
    }
    return this.getAffiliateId$().pipe(mergeMap(id => this._as.getById(id)))
  }

  private getAffiliateId$(): Observable<string> {
    if (this.workshopForm.value.affiliate)
      return of((this.workshopForm.value.affiliate as Affiliate).sfId)
    return this.user$.pipe(
      filter(isTruthy),
      // tslint:disable-next-line:no-non-null-assertion
      map(affiliateId),
    )
  }

  getFormErrors = getFormValidationErrors
}
