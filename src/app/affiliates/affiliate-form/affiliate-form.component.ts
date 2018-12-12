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

export type FormAction = 'create' | 'map' | 'update'
export interface AffiliateForm {
  action: FormAction
  id: string
  logo?: string
  name: string
  website?: string
  publicContact?: string
  publicContactEmail?: string
  publicContactPhone?: string
  languages?: string[]
}

export const transitionState = (current: FormAction): FormAction => {
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
  if (form.id) affiliate.Id = form.id
  if (form.name) affiliate.Name = form.name
  if (form.logo) affiliate.Logo__c = form.logo
  if (form.website) affiliate.Website = form.website
  if (form.publicContact) affiliate.Public_Contact__c = form.publicContact
  if (form.publicContactEmail)
    affiliate.Public_Contact_Email__c = form.publicContactEmail
  if (form.publicContactPhone)
    affiliate.Public_Contact_Phone__c = form.publicContactPhone
  if (form.languages) affiliate.languages = form.languages

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
  action: FormAction,
  affiliate: Affiliate,
  affService: AffiliateService,
):
  | ReturnType<AffiliateService['map']>
  | ReturnType<AffiliateService['create']>
  | ReturnType<AffiliateService['update']>
export function handleAffiliateAction(
  action: FormAction,
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
  private _id = ''
  get affId() {
    return (this.initialAffiliate && this.initialAffiliate.Id) || this._id
  }

  private _initialAffiliate?: Affiliate
  @Input('affiliate')
  get initialAffiliate() {
    return this._initialAffiliate
  }
  set initialAffiliate(data: Affiliate | undefined) {
    if (data) {
      this._initialAffiliate = data
      this.patchValue(data)
      this.action = transitionState(this.action)
    }
  }

  @Input()
  action: FormAction = 'create'
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

  ngOnInit() {
    this.affForm = this.buildForm()
  }

  ngOnDestroy() {
    if (this.routeSubscription) this.routeSubscription.unsubscribe()
  }

  affiliateSearch = (query: string): Observable<Affiliate[]> =>
    this._as.search(query, this.extraFields)

  getFormErrors = getFormValidationErrors

  getButtonString(state: FormAction): string {
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
        this.initialAffiliate && this.initialAffiliate.Name,
        Validators.required,
      ],
      logo: [
        this.initialAffiliate && this.initialAffiliate.Logo__c,
        CustomValidators.url,
      ],
      website: [
        this.initialAffiliate && this.initialAffiliate.Website,
        CustomValidators.url,
      ],
      publicContact: [
        this.initialAffiliate && this.initialAffiliate.Public_Contact__c,
      ],
      publicContactEmail: [
        this.initialAffiliate && this.initialAffiliate.Public_Contact_Email__c,
        Validators.email,
      ],
      publicContactPhone: [
        this.initialAffiliate && this.initialAffiliate.Public_Contact_Phone__c,
      ],
      languages: [
        (this.initialAffiliate && this.initialAffiliate.languages) || [],
      ],
    })
    return affForm
  }

  private patchValue(affiliate: Affiliate) {
    if (!this.affForm) return
    this._id = affiliate.Id
    this.affForm.patchValue({
      logo: affiliate.Logo__c,
      name: affiliate.Name,
      website: affiliate.Website,
      publicContact: affiliate.Public_Contact__c,
      publicContactEmail: affiliate.Public_Contact_Email__c,
      publicContactPhone: affiliate.Public_Contact_Phone__c,
      languages: affiliate.languages,
    })
  }

  selectedAffiliate(affiliate?: Affiliate) {
    this.initialAffiliate = affiliate
  }

  onSave() {
    const form = this.affForm.value as AffiliateForm
    form.action = this.action
    form.id = this.affId
    this.submitted.emit(form)
  }

  displayFn = (affilate?: Affiliate) => {
    return affilate ? affilate.name : ''
  }
}
