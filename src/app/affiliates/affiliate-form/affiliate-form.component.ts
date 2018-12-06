import { map, startWith } from 'rxjs/operators'
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core'
import { Location } from '@angular/common'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'

import { Affiliate } from '../affiliate.model'
import {
  AffiliateService,
  DEFAULT_AFFILIATE_SEARCH_FIELDS,
} from '../../services/affiliate/affiliate.service'

import { Subscription, Observable, of } from 'rxjs'
import { CustomValidators } from 'ng2-validation'

// Lodash functions
import { normalizeString, getFormValidationErrors } from '../../util/util'

export type AffiliateFormAction = 'create' | 'map' | 'update'
export interface AffiliateForm {
  action: AffiliateFormAction
  id: string
  logo: string
  name: string
  website: string
  publicContact: string
  publicContactEmail: string
  publicContactPhone: string
  languages: string[]
}

export const transitionState = (
  current: AffiliateFormAction,
): AffiliateFormAction => {
  switch (current) {
    case 'create':
      return 'map'
    default:
      return current
  }
}

export const addToAffiliate = (
  form: AffiliateForm,
  affiliate = new Affiliate(),
) => {
  if (form.id) {
    affiliate.Id = form.id
  }
  affiliate.Logo__c = form.logo
  affiliate.Name = form.name
  affiliate.Website = form.website
  affiliate.Public_Contact__c = form.publicContact
  affiliate.Public_Contact_Email__c = form.publicContactEmail
  affiliate.Public_Contact_Phone__c = form.publicContactPhone
  affiliate.languages = form.languages

  return affiliate
}

export function handleAffiliateAction(
  action: 'map',
  affiliate: Affiliate,
  affService: AffiliateService,
): ReturnType<AffiliateService['map']>
export function handleAffiliateAction(
  action: 'update',
  affiliate: Affiliate,
  affService: AffiliateService,
): ReturnType<AffiliateService['update']>
export function handleAffiliateAction(
  action: 'create',
  affiliate: Affiliate,
  affService: AffiliateService,
): ReturnType<AffiliateService['create']>
export function handleAffiliateAction(
  action: AffiliateFormAction,
  affiliate: Affiliate,
  affService: AffiliateService,
):
  | ReturnType<AffiliateService['map']>
  | ReturnType<AffiliateService['create']>
  | ReturnType<AffiliateService['update']>
export function handleAffiliateAction(
  action: AffiliateFormAction,
  affiliate: Affiliate,
  affService: AffiliateService,
):
  | ReturnType<AffiliateService['map']>
  | ReturnType<AffiliateService['create']>
  | ReturnType<AffiliateService['update']> {
  switch (action) {
    case 'create':
      return affService.create(affiliate)
    case 'update':
      return affService.update(affiliate)
    case 'map':
      return affService.map(affiliate)
  }
}

@Component({
  selector: 'app-affiliate-form',
  templateUrl: './affiliate-form.component.html',
  styleUrls: ['./affiliate-form.component.scss'],
})
export class AffiliateFormComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:no-input-rename
  private _id = ''
  get affId() {
    return (this.initialAffiliate && this.initialAffiliate.Id) || this._id
  }

  @Input('affiliate')
  set initialAffiliate(data: Affiliate | undefined) {
    if (data) {
      this.patchValue(data)
    }
  }

  @Input()
  action: AffiliateFormAction = 'create'
  @Input()
  pending = false
  @Output()
  submitted = new EventEmitter<AffiliateForm>()

  private extraFields: string[] = [
    'Public_Contact__c',
    'Public_Contact_Email__c',
    'Public_Contact_Phone__c',
    ...DEFAULT_AFFILIATE_SEARCH_FIELDS,
  ]

  isLoading = false
  isDialog = false
  private routeSubscription?: Subscription
  affForm!: FormGroup
  languages$ = of([] as string[])

  languageFilterControl = new FormControl()

  constructor(
    public location: Location,
    private _as: AffiliateService,
    private fb: FormBuilder,
  ) {
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
  }

  public ngOnInit() {
    this.affForm = this.buildForm()
  }

  public ngOnDestroy() {
    if (this.routeSubscription) this.routeSubscription.unsubscribe()
  }

  affiliateSearch = (query: string): Observable<Affiliate[]> =>
    this._as.search(query, this.extraFields)

  getFormErrors = getFormValidationErrors

  public getButtonString(state: AffiliateFormAction): string {
    switch (state) {
      case 'create':
        return 'Save New'
      case 'map':
        return 'Add Existing to Portal'
      case 'update':
        return 'Update'
    }
  }

  private buildForm() {
    const affForm = this.fb.group({
      name: [
        this.initialAffiliate && this.initialAffiliate.name,
        Validators.required,
      ],
      logo: [this.initialAffiliate && this.initialAffiliate.logo],
      website: [
        this.initialAffiliate && this.initialAffiliate.website,
        CustomValidators.url,
      ],
      publicContact: [
        this.initialAffiliate && this.initialAffiliate.publicContact,
      ],
      publicContactEmail: [
        this.initialAffiliate && this.initialAffiliate.publicContactEmail,
        Validators.email,
      ],
      publicContactPhone: [
        this.initialAffiliate && this.initialAffiliate.publicContactPhone,
      ],
      languages: [this.initialAffiliate && this.initialAffiliate.languages],
    })
    return affForm
  }

  private patchValue(affiliate: Affiliate) {
    if (!this.affForm) return
    this._id = affiliate.Id
    this.affForm.patchValue({
      logo: affiliate.logo,
      name: affiliate.name,
      website: affiliate.website,
      publicContact: affiliate.publicContact,
      publicContactEmail: affiliate.publicContactEmail,
      publicContactPhone: affiliate.publicContactPhone,
      languages: affiliate.languages,
    })
  }

  public selectedAffiliate(affiliate?: Affiliate) {
    if (affiliate) {
      this.patchValue(affiliate)
      this.action = transitionState(this.action)
    }
  }

  public onSave() {
    const form = this.affForm.value as AffiliateForm
    form.action = this.action
    form.id = this.affId
    this.submitted.emit(form)
  }

  displayFn = (affilate?: Affiliate) => {
    return affilate ? affilate.name : ''
  }
}
