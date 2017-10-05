// Angular Modules
import { Component, ViewChild, ElementRef, QueryList, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MdCheckbox, MdAutocomplete, MdAutocompleteTrigger, MdOption, MdOptionSelectionChange, MdSnackBar } from '@angular/material';

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

  public isLoading: boolean = false;

  public get dateFormGroup(): FormGroup { return this.workshopForm.get('dates') as FormGroup; }

  public countries: string[] = [];
  public countryOptions: string[] = [];
  public workshopForm: FormGroup;
  public courseManagers: CourseManager[] = [];
  public facilitatorOpts: Facilitator[] = [];
  public affiliates: Affiliate[] = [];
  public describe: any = {};
  public today: Date = new Date();
  public tomorrow: Date = new Date(this.today.valueOf() + (1000 * 60 * 60 * 24));


  public workshopTypes: string[] = ['Discover', 'Enable', 'Improve', 'Align', 'Build'];
  public languages: string[] = Affiliate.DEFAULT_LANGUAGE_OPTIONS;
  public statuses: string[] = [
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
    public router: Router,
    public auth: AuthService,
    public _cs: CountriesService,
    public _fs: FacilitatorService,
    public _as: AffiliateService,
    public _ws: WorkshopService,
    public snackbar: MdSnackBar) { }

  public ngOnInit() {
    this.createForm();
    this.subscribeToCountry();
    this.subscribeToIsPublic();
    this.getWorkshopDescription();
  }

  public createForm() {
    const dateFormGroup = this.fb.group({
      startDate: [this.workshop.startDate],
      endDate: [this.workshop.endDate]
    });

    this.workshopForm = this.fb.group({
      affiliate: [this.workshop.affiliate || new Affiliate(), Validators.required],
      type: [this.workshop.type, Validators.required],
      status: [this.workshop.status, Validators.required],
      language: [this.workshop.language],
      isPublic: [this.workshop.isPublic, Validators.required],
      city: [this.workshop.city, Validators.required],
      country: [this.workshop.country, Validators.required],
      hostSite: [this.workshop.hostSite, Validators.required],
      courseManager: [this.workshop.courseManager || new CourseManager(), Validators.required],
      dates: this.fb.group({
        startDate: [this.workshop.startDate || new Date(), Validators.required],
        endDate: [this.workshop.endDate || new Date(Date.now()), Validators.required]
      }),
      website: [this.workshop.website],
      billing: [this.workshop.billing, [Validators.required, Validators.email]],
      facilitator: ['']
    });

    const dateRangeValidator = (c: AbstractControl): ValidationErrors => {
      try {
        const start = c.get('startDate').value;
        const end = c.get('endDate').value;
        return start.valueOf() <= end.valueOf() ? null : { 'invalid date': 'ending date must be on or after the starting date.' } as ValidationErrors;
      } catch (e) {
        return null;
      }
    };

    this.dateFormGroup.setValidators(dateRangeValidator);
  }

  public onSubmit() {
    this.isLoading = true;
    this.workshop = this.mergeWorkshopData();
    if (!this.auth.user.isAdmin) { this.workshop.affiliateId = this.auth.user.affiliate; }

    this.submitFunction(this.workshop)
      .subscribe((result: ISFSuccessResult) => {
        this.router.navigateByUrl(`/workshops/${result.id}`);
        this.isLoading = false;
      }
      , err => {
        console.error('error submitting workshop', err);
        this.isLoading = false;
        this.snackbar.open('An error occurred and the requested operation could not be completed.', 'Okay', { extraClasses: ['md-warn'] });
      });
  }

  public mergeWorkshopData(): Workshop {
    const form = this.workshopForm.value;
    form.startDate = form.dates.startDate;
    form.endDate = form.dates.endDate;
    delete form.dates;
    return merge(this.workshop, form);
  }

  public contactDisplayWith(value) {
    return value ? value.name : '';
  }

  public onFacilitatorSelected(facilitator: Facilitator) {
    this.workshop.addInstructor(facilitator);
    this.workshopForm.controls.facilitator.setValue('');
  }

  public onSelectAffiliate(affiliate: Affiliate) {
    this.workshop.affiliate = affiliate;
  }

  public onSelectCourseManager(courseManager: CourseManager) {
    this.workshop.courseManager = courseManager;
  }

  public checkValidSFObject(control): void {
    if (control.value && !control.value.sfId) {
      control.setValue(undefined);
    }
  }

  public getAffiliate(): string {
    if (this.workshopForm.value.affiliate.sfId) return this.workshopForm.value.affiliate.sfId;
    else return this.auth.user.affiliate;
  }

  /**
     * @description Retrieves a list of countries from {@link CountriesService} to pick from for the eventCountry FormControl.
     * Listens to value changes of the country FormControl and displays filtered results in the auto-complete.
     */
  public subscribeToCountry() {
    const countryFC = this.workshopForm.get('country');
    countryFC.valueChanges.subscribe(q =>
      this.countryOptions = q ? this.countries.filter(option => new RegExp(`${q}`, 'gi').test(option)) : this.countries
    );

    this._cs.get().subscribe(countries => this.countries = countries, err => console.error(err));
  }

  public subscribeToIsPublic() {
    const publicChanges$ = this.workshopForm.controls.isPublic.valueChanges;
    publicChanges$.subscribe(isPublic => {
      const websiteControl = this.workshopForm.controls.website;

      if (isPublic)
        websiteControl.setValidators([Validators.required, CustomValidators.url]);
      else {
        websiteControl.clearValidators();
      }

      websiteControl.setValue('https://');
      websiteControl.updateValueAndValidity();
    });
  }

  public prefixWebsite() {
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
  public getWorkshopDescription() {
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
  public getWorkshopTypes() {
    try {
      this.workshopTypes = this.describe.workshopType.picklistValues.map(option => option.label);
    } catch (e) {
      console.warn('Failed to get workshop types from `this.describe.workshopType.picklistValues`. Using default values.');
    }
  }

  public getWorkshopStatuses() {
    try {
      this.statuses = this.describe.status.picklistValues.map(option => option.label);
    } catch (e) {
      console.warn('Failed to get workshop statuses from `this.describe.status.picklistValues`. Using default values.', this.describe);
    }
  }

}
