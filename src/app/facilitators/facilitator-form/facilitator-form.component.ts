import { Component, Input, EventEmitter, Output } from '@angular/core'
import { Location } from '@angular/common'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'

import { Facilitator, FacilitatorRoleType } from '../facilitator.model'
import { FacilitatorService } from '../../services/facilitator/facilitator.service'
import { Affiliate } from '../../affiliates/affiliate.model'
import {
  AffiliateService,
  DEFAULT_AFFILIATE_SEARCH_FIELDS,
} from '../../services/affiliate/affiliate.service'
import { CustomValidators } from 'ng2-validation'
import {
  FormAction,
  transitionState,
} from '../../affiliates/affiliate-form/affiliate-form.component'

export interface FacilitatorForm {
  action: FormAction
  id: string
  email: string
  firstName: string
  lastName: string
  title?: string
  photo?: string
  role: 'Facilitator' | 'Course Manager' | 'Affiliate Manager'
  affiliate: Affiliate
}

export const addToFacilitator = (
  form: FacilitatorForm,
  fac = new Facilitator(),
) => {
  if (form.id) fac.Id = form.id
  if (form.firstName) fac.FirstName = form.firstName
  if (form.lastName) fac.LastName = form.lastName
  if (form.email) fac.Email = form.email
  if (form.title) fac.Title = form.title
  if (form.photo) fac.Photograph__c = form.photo
  if (form.role) fac.role = form.role
  if (form.affiliate) fac.affiliate = form.affiliate

  return fac
}

export function handleFacilitatorAction(
  action: 'map',
  fac: Facilitator,
  facService: FacilitatorService,
): ReturnType<FacilitatorService['map']>
export function handleFacilitatorAction(
  action: 'update',
  fac: Facilitator,
  facService: FacilitatorService,
): ReturnType<FacilitatorService['update']>
export function handleFacilitatorAction(
  action: 'create',
  fac: Facilitator,
  facService: FacilitatorService,
): ReturnType<FacilitatorService['create']>
export function handleFacilitatorAction(
  action: FormAction,
  fac: Facilitator,
  facService: FacilitatorService,
):
  | ReturnType<FacilitatorService['map']>
  | ReturnType<FacilitatorService['create']>
  | ReturnType<FacilitatorService['update']>
export function handleFacilitatorAction(
  action: FormAction,
  fac: Facilitator,
  facService: FacilitatorService,
):
  | ReturnType<FacilitatorService['map']>
  | ReturnType<FacilitatorService['create']>
  | ReturnType<FacilitatorService['update']> {
  switch (action) {
    case 'create':
      return facService.create(fac)
    case 'update':
      return facService.update(fac)
    case 'map':
      return facService.map(fac)
  }
}

@Component({
  selector: 'app-facilitator-form',
  templateUrl: './facilitator-form.component.html',
  styleUrls: ['./facilitator-form.component.scss'],
})
export class FacilitatorFormComponent {
  private _id = ''
  get facId() {
    return (this.initialFacilitator && this.initialFacilitator.Id) || this._id
  }

  private _initialFacilitator?: Facilitator
  @Input('facilitator')
  get initialFacilitator() {
    return this._initialFacilitator
  }
  set initialFacilitator(data: Facilitator | undefined) {
    if (data) {
      this._initialFacilitator = data
      this.patchValue(data)
      this.action = transitionState(this.action)
    }
  }

  @Input()
  pending = false
  @Input()
  action: FormAction = 'create'
  @Output()
  submitted = new EventEmitter<FacilitatorForm>()

  formGroup: FormGroup
  roles: FacilitatorRoleType[] = Facilitator.DEFAULT_ROLE_OPTIONS

  constructor(
    private _fs: FacilitatorService,
    private _as: AffiliateService,
    public location: Location,
    private fb: FormBuilder,
  ) {
    this.formGroup = this.buildForm()
  }

  affiliateSearch = (query: string) =>
    this._as.search(query, DEFAULT_AFFILIATE_SEARCH_FIELDS)

  facilitatorSearch = (query: string) =>
    this._fs.search(query, undefined, false)

  buildForm() {
    const form = this.fb.group({
      email: [
        this.initialFacilitator && this.initialFacilitator.Email,
        [Validators.required, Validators.email],
      ],
      firstName: [
        this.initialFacilitator && this.initialFacilitator.FirstName,
        Validators.required,
      ],
      lastName: [
        this.initialFacilitator && this.initialFacilitator.LastName,
        Validators.required,
      ],
      title: [this.initialFacilitator && this.initialFacilitator.Title],
      photo: [
        (this.initialFacilitator && this.initialFacilitator.Photograph__c) ||
          'https://res.cloudinary.com/shingo/image/upload/c_thumb,e_trim:10,g_center,h_100,w_100/v1414874243/silhouette_vzugec.png',
        CustomValidators.url,
      ],
      role: [
        this.initialFacilitator && this.initialFacilitator.role,
        Validators.required,
      ],
      affiliate: [
        this.initialFacilitator && this.initialFacilitator.affiliate,
        Validators.required,
      ],
    })

    if (!form.controls.affiliate.value) {
      this.disableRoleField(form)
    }

    form.controls.affiliate.valueChanges.subscribe(val => {
      if (val && val instanceof Affiliate && val.Id !== '') {
        this.enableRoleField(form)
      } else {
        this.disableRoleField(form)
      }
    })

    return form
  }

  private patchValue(f: Facilitator) {
    this._id = f.Id
    this.formGroup.patchValue({
      email: f.Email,
      firstName: f.FirstName,
      lastName: f.LastName,
      title: f.Title,
      photo: f.Photograph__c,
      role: f.role,
      affiliate: f.affiliate,
    })
    this.formGroup.controls.affiliate.updateValueAndValidity()
  }

  /**
   * onSelectFacilitator is invoked when a user is selected from the app-search on the facilitator form
   * @param {Facilitator} f: the facilitator object the user selected
   */
  onSelectFacilitator(f: Facilitator) {
    if (f && f instanceof Facilitator) {
      this.initialFacilitator = f
    }
  }

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

  onSave() {
    const form = this.formGroup.value as FacilitatorForm
    form.action = this.action
    form.id = this.facId
    this.submitted.emit(form)
  }

  displayFn = (obj: Facilitator | Affiliate | string): string => {
    if (obj instanceof Facilitator) return obj.email
    else if (obj instanceof Affiliate) return obj.name
    else if (typeof obj === 'string') return obj
    else return String(obj)
  }

  private enableRoleField(form: FormGroup) {
    const control = form.get('role')
    if (control) control.enable()
  }

  private disableRoleField(form: FormGroup) {
    const control = form.get('role')
    if (control) control.disable()
  }
}
