// Angular Modules
import { Component, ViewChild, ElementRef, QueryList, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { MdCheckbox, MdAutocomplete, MdAutocompleteTrigger, MdOption, MdOptionSelectionChange } from '@angular/material';

// App Modules
import { AuthService } from '../../services/auth/auth.service';
import { CountriesService } from '../../services/countries/countries.service';
import { FacilitatorService } from '../../services/facilitator/facilitator.service';
import { AffiliateService } from '../../services/affiliate/affiliate.service';
import { WorkshopService } from '../../services/workshop/workshop.service';
import { ISFSuccessResult } from '../../services/api/base-api.abstract.service';
import { Workshop, WorkshopType } from '../workshop.model';
import { CourseManager } from '../course-manager.model';
import { Facilitator } from '../../facilitators/facilitator.model';
import { Affiliate } from '../../affiliates/affiliate.model';

// RxJS Modules
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

// RxJS operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/onErrorResumeNext';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/throw';

// Lodash functions
import { merge } from 'lodash';

import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-workshop-form',
  templateUrl: './workshop-form.component.html',
  styleUrls: ['./workshop-form.component.scss']
})
export class WorkshopFormComponent implements OnInit {

  @Input() public submitFunction: (workshop: Workshop) => Observable<ISFSuccessResult>;
  @Input() public workshop: Workshop = new Workshop();

  private isLoading: boolean = false;

  private countries: string[] = [];
  private countryOptions: string[] = [];
  private workshopForm: FormGroup;
  private courseManagers: CourseManager[] = [];
  private facilitatorOpts: Facilitator[] = [];
  private affiliates: Affiliate[] = [];
  private describe: any = {};


  private workshopTypes: string[] = ['Discover', 'Enable', 'Improve', 'Align', 'Build'];
  private languages: string[] = Affiliate.DEFAULT_LANGUAGE_OPTIONS;
  private statuses: string[] = [
    'Invoiced, Not Paid',
    'Finished, waiting for attendee list',
    'Awaiting Invoice',
    'Proposed',
    'Archived',
    'Cancelled',
    'Active, not ready for app',
    'Active Event'
  ];

  constructor(public fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private _cs: CountriesService,
    private _fs: FacilitatorService,
    private _as: AffiliateService,
    private _ws: WorkshopService) { }

  public ngOnInit() {
    this.createForm();
    this.subscribeToCountry();
    this.subscribeToIsPublic();
    this.getWorkshopDescription();
  }

  private createForm() {
    this.workshopForm = this.fb.group({
      affiliate: [this.workshop.affiliate || new Affiliate(), Validators.required],
      type: [this.workshop.type, Validators.required],
      status: [this.workshop.status, Validators.required],
      language: [this.workshop.language],
      isPublic: [this.workshop.isPublic, Validators.required],
      city: [this.workshop.city, Validators.required],
      country: [this.workshop.country, Validators.required],
      hostSite: [this.workshop.hostSite, Validators.required],
      courseManager: [this.workshop.courseManager, Validators.required],
      startDate: [this.workshop.startDate || new Date(), Validators.required],
      endDate: [this.workshop.endDate || new Date(Date.now() + (1000 * 60 * 60 * 24)), Validators.required],
      website: [this.workshop.website, CustomValidators.url],
      billing: [this.workshop.billing, [Validators.required, Validators.email]],
      facilitator: ['']
    });
  }

  private onSubmit() {
    this.isLoading = true;
    this.workshop = merge(this.workshop, this.workshopForm.value);
    if (!this.auth.user.isAdmin) this.workshop.affiliateId = this.auth.user.affiliate;
    else this.workshop.affiliateId = this.workshopForm.controls.affiliate.value.sfObject.sfId;

    this.workshop.courseManager = this.workshopForm.value.courseManager.sfObject;

    this.submitFunction(this.workshop)
      .subscribe((result: ISFSuccessResult) => {
        this.router.navigateByUrl(`/workshops/${result.id}`);
        this.isLoading = false;
      }
      , err => console.error('error submitting workshop', err));
  }

  private contactDisplayWith(value) {
    return value ? value.name : '';
  }

  private onFacilitatorSelected(facilitator: Facilitator) {
    this.workshop.addInstructor(facilitator);
    this.workshopForm.controls.facilitator.setValue('');
  }

  private checkValidSFObject(control): void {
    if (control.value && !control.value.sfId) {
      control.setValue(undefined);
    }
  }

  private getAffiliate(): string {
    if (this.workshopForm.value.affiliate.sfId) return this.workshopForm.value.affiliate.sfId;
    else return this.auth.user.affiliate;
  }

  /**
     * @description Retrieves a list of countries from {@link CountriesService} to pick from for the eventCountry FormControl.
     * Listens to value changes of the country FormControl and displays filtered results in the auto-complete.
     */
  private subscribeToCountry() {
    const countryFC = this.workshopForm.get('country');
    countryFC.valueChanges.subscribe(q =>
      this.countryOptions = q ? this.countries.filter(option => new RegExp(`${q}`, 'gi').test(option)) : this.countries
    );

    this._cs.get().subscribe(countries => this.countries = countries, err => console.error(err));
  }

  private subscribeToIsPublic() {
    const publicChanges$ = this.workshopForm.controls.isPublic.valueChanges;
    publicChanges$.subscribe(isPublic => {
      const websiteControl = this.workshopForm.controls.website;

      if (isPublic)
        websiteControl.setValidators([Validators.required, CustomValidators.url]);
      else {
        websiteControl.clearValidators();
        websiteControl.setValidators(CustomValidators.url);
      }

      websiteControl.setValue('https://');
      websiteControl.updateValueAndValidity();
    });
  }

  private prefixWebsite() {
    const websiteControl = this.workshopForm.controls.website;
    let value: string = websiteControl.value;
    if (value.match(/https:\/\/.*/)) return;

    value = value.replace(/http(s{0,1}):.{0,2}/, '');
    value = 'https://' + value;

    websiteControl.setValue(value);

    websiteControl.updateValueAndValidity();
  }

  /**
     * @description Gets an object (`this.describe`) from the api that is used to set helper text, labels, and picklist values
     */
  private getWorkshopDescription() {
    this._ws.describe().subscribe(data => {
      this.describe = data;
      this.getWorkshopTypes();
      this.getWorkshopStatuses();
    }, err => {
      console.error(err);
    });
  }

  /**
   * @description Sets value for `this.workshopTypes` from `this.describe`, or sets a default value if `this.describe` is null.
   */
  private getWorkshopTypes() {
    try {
      this.workshopTypes = this.describe.workshopType.picklistValues.map(option => option.label);
    } catch (e) {
      console.warn('Failed to get workshop types from `this.describe.workshopType.picklistValues`. Using default values.');
    }
  }

  private getWorkshopStatuses() {
    try {
      this.statuses = this.describe.status.picklistValues.map(option => option.label);
    } catch (e) {
      console.warn('Failed to get workshop statuses from `this.describe.status.picklistValues`. Using default values.', this.describe);

    }
  }

}
