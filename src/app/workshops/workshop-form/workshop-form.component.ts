// Angular Modules
import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material'

// App Modules
import { AuthService } from '../../services/auth/auth.service'
import {
  CountriesService,
  CountryItem,
} from '../../services/countries/countries.service'
import { FacilitatorService } from '../../services/facilitator/facilitator.service'
import { AffiliateService } from '../../services/affiliate/affiliate.service'
import { WorkshopService } from '../../services/workshop/workshop.service'
import { SFSuccessResult } from '../../services/api/base-api.abstract.service'
import { Workshop } from '../workshop.model'
import { CourseManager } from '../course-manager.model'
import { Facilitator } from '../../facilitators/facilitator.model'
import { Affiliate } from '../../affiliates/affiliate.model'

// RxJS Modules
import { Observable, of } from 'rxjs'

// RxJS operators

// Lodash functions
import { merge } from 'lodash'

import { CustomValidators } from 'ng2-validation'
import { LocaleService } from '../../services/locale/locale.service'
import { mergeMap, map, startWith } from 'rxjs/operators'

const MILLI_DAY = 1000 * 60 * 60 * 24

// see https://thread.engineering/2018-08-29-searching-and-sorting-text-with-diacritical-marks-in-javascript/
const normalizeString = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

@Component({
  selector: 'app-workshop-form',
  templateUrl: './workshop-form.component.html',
  styleUrls: ['./workshop-form.component.scss'],
})
export class WorkshopFormComponent implements OnInit {
  @Input()
  public submitFunction!: (workshop: Workshop) => Observable<SFSuccessResult>
  @Input()
  public workshop: Workshop = new Workshop()
  @Input()
  public isNewWorkshop!: boolean

  public isLoading = false

  public get dateFormGroup(): FormGroup {
    return this.workshopForm.get('dates') as FormGroup
  }

  public countryOptions: Observable<
    Array<{ name: string; translations: Record<string, string> }>
  > = of([])
  public workshopForm!: FormGroup
  public countryFilterControl = new FormControl()
  public courseManagers: CourseManager[] = []
  public facilitatorOpts: Facilitator[] = []
  public affiliates: Affiliate[] = []
  public describe: any = {}

  public workshopTypes: string[] = [
    'Discover',
    'Enable',
    'Improve',
    'Align',
    'Build',
  ]
  public languages: string[] = Affiliate.DEFAULT_LANGUAGE_OPTIONS
  public statuses: string[] = [
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
    public fb: FormBuilder,
    public router: Router,
    public auth: AuthService,
    private _cs: CountriesService,
    private locale: LocaleService,
    public _fs: FacilitatorService,
    public _as: AffiliateService,
    public _ws: WorkshopService,
    public snackbar: MatSnackBar,
  ) {}

  public ngOnInit() {
    this.createForm()
    this.subscribeToCountry()
    this.subscribeToIsPublic()
    this.getWorkshopDescription()
  }

  /**
   * @description Retrieves a list of countries from {@link CountriesService} to pick from for the eventCountry FormControl.
   * Listens to value changes of the country FormControl and displays filtered results in the auto-complete.
   */
  private subscribeToCountry() {
    const countryList = this._cs.get()
    this.countryOptions = this.countryFilterControl.valueChanges.pipe(
      startWith(''),
      map((v: any) => (typeof v === 'string' ? v : (v && String(v)) || '')),
      mergeMap(value =>
        countryList.pipe(
          map(countries => {
            return countries.filter(v =>
              normalizeString(this.getLocalizedName(v)).startsWith(
                normalizeString(value),
              ),
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

  public getLocalizedName(item: CountryItem) {
    const subtag = this.locale.primarySubtag
    return item.translations[subtag] || item.name
  }

  public createForm() {
    const dateFormGroup = this.fb.group({
      startDate: [this.workshop.startDate],
      endDate: [this.workshop.endDate],
    })

    this.workshopForm = this.fb.group({
      affiliate: [
        this.workshop.affiliate || new Affiliate(),
        Validators.required,
      ],
      type: [this.workshop.type, Validators.required],
      status: [this.workshop.status, Validators.required],
      language: [this.workshop.language],
      isPublic: [this.workshop.isPublic, Validators.required],
      city: [this.workshop.city, Validators.required],
      country: [this.workshop.country, Validators.required],
      hostSite: [this.workshop.hostSite, Validators.required],
      courseManager: [
        this.workshop.courseManager || new CourseManager(),
        Validators.required,
      ],
      dates: this.fb.group({
        startDate: [
          this.workshop.startDate || new Date(Date.now() - MILLI_DAY),
          Validators.required,
        ],
        endDate: [
          this.workshop.endDate || new Date(Date.now() + MILLI_DAY * 2),
          Validators.required,
        ],
      }),
      website: [this.workshop.website],
      billing: [this.workshop.billing, [Validators.required, Validators.email]],
      facilitator: [''],
    })
  }

  public onSubmit() {
    this.isLoading = true
    this.workshop = this.mergeWorkshopData()
    if (!this.auth.user) return
    if (!this.auth.user.isAdmin) {
      this.workshop.affiliateId = this.auth.user.affiliate
    }

    this.submitFunction(this.workshop).subscribe(
      (result: SFSuccessResult) => {
        this.router.navigateByUrl(`/workshops/${result.id}`)
        this.isLoading = false
      },
      err => {
        console.error('error submitting workshop', err)
        this.isLoading = false
        this.snackbar.open(
          'An error occurred and the requested operation could not be completed.',
          'Okay',
          { panelClass: ['md-warn'] },
        )
      },
    )
  }

  public mergeWorkshopData(): Workshop {
    const form = this.workshopForm.value
    form.startDate = form.dates.startDate
    form.endDate = form.dates.endDate
    delete form.dates
    return merge(this.workshop, form)
  }

  public contactDisplayWith(value: null | undefined | { name: string }) {
    return value ? value.name : ''
  }

  public onFacilitatorSelected(facilitator: Facilitator) {
    this.workshop.addInstructor(facilitator)
    this.workshopForm.controls.facilitator.setValue('')
  }

  public onSelectAffiliate(affiliate: Affiliate) {
    this.workshop.affiliate = affiliate
  }

  public onSelectCourseManager(courseManager: CourseManager) {
    this.workshop.courseManager = courseManager
  }

  public checkValidSFObject(control: FormControl): void {
    if (control.value && !control.value.sfId) {
      control.setValue(undefined)
    }
  }

  public getAffiliate(): string {
    if (!this.auth.user) {
      throw new Error(
        'Dont know how this happened, but the user is not logged in',
      )
    }
    if (this.workshopForm.value.affiliate.sfObject)
      return this.workshopForm.value.affiliate.sfObject.sfId
    else return this.auth.user.affiliate
  }

  public prefixWebsite() {
    const websiteControl = this.workshopForm.controls.website
    let value: string = websiteControl.value
    if (value.match(/https:\/\/.*/)) return

    value = value.replace(/http(s{0,1}):.{0,2}/, '')
    value = 'https://' + value

    websiteControl.setValue(value)

    websiteControl.updateValueAndValidity()
  }

  /**
   * @description Sets value for `this.workshopTypes` from `this.describe`, or sets a default value if `this.describe` is null.
   */
  public getWorkshopTypes() {
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

  public getWorkshopStatuses() {
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
