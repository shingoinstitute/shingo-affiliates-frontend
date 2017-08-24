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
import { SFSuccessResult } from '../../services/base-api.abstract.service';
import { Workshop, WorkshopType } from '../Workshop';
import { CourseManager } from '../../shared/models/CourseManager';
import { Facilitator } from '../../facilitators/Facilitator';
import { Affiliate } from '../../affiliates/Affiliate';

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

@Component({
  selector: 'app-workshop-form',
  templateUrl: './workshop-form.component.html',
  styleUrls: ['./workshop-form.component.scss']
})
export class WorkshopFormComponent implements OnInit {

  @Input() submitFunction: (Workshop) => Observable<SFSuccessResult>;
  @Input() workshop: Workshop = new Workshop();

  private debounceTime: number = 250;

  private loadingAF: boolean = false;
  private queryChangeAF$: Subject<string> = new Subject<string>();
  private changeAF$: BehaviorSubject<Affiliate[]> = new BehaviorSubject<Affiliate[]>([]);

  private loadingInstructors: boolean = false;
  private facilitatorQueryChange$: Subject<string> = new Subject<string>();
  private facilitatorChange$: BehaviorSubject<Facilitator[]> = new BehaviorSubject<Facilitator[]>([]);

  private loadingCms: boolean = false;
  private courseManagerQuery$: Subject<string> = new Subject<string>();
  private courseManagersChange$: BehaviorSubject<CourseManager[]> = new BehaviorSubject<CourseManager[]>([]);

  private countries: string[] = [];
  private countryOptions: string[] = [];
  private workshopForm: FormGroup;
  private courseManagers: CourseManager[] = [];
  private facilitatorOpts: Facilitator[] = [];
  private affiliates: Affiliate[] = [];
  private describe: any = {};


  private workshopTypes: string[] = ['Discover', 'Enable', 'Improve', 'Align', 'Build'];
  private languages: string[] = ['English', 'Spanish', 'German', 'French', 'Mandarin', 'Cantonese', 'Italian', 'Hindi', 'Portuguese (Brazilian)', 'Japanese', 'Dutch', 'Chinese'];
  private statuses: string[] = ['Invoiced, Not Paid', 'Finished, waiting for attendee list', 'Awaiting Invoice', 'Proposed', 'Archived', 'Cancelled', 'Active, not ready for app', 'Active Event'];

  constructor(public fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private _cs: CountriesService,
    private _fs: FacilitatorService,
    private _as: AffiliateService,
    private _ws: WorkshopService) { }

  public ngOnInit() {
    this.createForm();
    this.subscribeToQueryAF();
    this.subscribeToFacilitatorQuery();
    this.subscribeToCourseManagerQuery();
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
      website: [this.workshop.website],
      billing: [this.workshop.billing, [Validators.required, Validators.email]],
      facilitator: ['']
    });
  }

  private onSubmit() {
    this.workshop = merge(this.workshop, this.workshopForm.value);
    if (!this.auth.user.isAdmin) this.workshop.affiliateId = this.auth.user.affiliate;
    else this.workshop.affiliateId = this.workshopForm.controls.affiliate.value.sfId;

    console.log('SUBMITTED DATA', this.workshop);
    this.submitFunction(this.workshop)
      .subscribe((result: SFSuccessResult) => this.router.navigateByUrl(`/workshops/${result.id}`)
      , err => console.error('error submitting workshop', err));
  }

  private contactDisplayWith(value) {
    return value ? value.name : '';
  }

  private onFacilitatorSelected(facilitator: Facilitator) {
    this.workshop.addInstructor(facilitator);
    this.workshopForm.controls.facilitator.setValue('');
  }

  private checkValidCM(): void {
    const cmControl = this.workshopForm.controls.courseManager;
    if (!cmControl.value.sfId) {
      cmControl.setValue(undefined);
    }
  }

  private checkValidAutoComplete(event): void {
    console.log(event);
  }

  private subscribeToQueryAF() {
    const affiliate = this.workshopForm.controls.affiliate;
    affiliate.valueChanges
      .distinctUntilChanged()
      .subscribe(value => {
        if (value && value.length > 2) {
          this.loadingAF = true;
          this.queryChangeAF$.next(`${value}*`);
        }
      });

    this.valueChangesAF()
      .subscribe((data: Affiliate[]) => {
        setTimeout(() => this.loadingAF = false, 150);
        this.affiliates = data;
      }, err => console.log(err));
  }


  private valueChangesAF(): BehaviorSubject<Affiliate[]> {
    this.queryChangeAF$.distinctUntilChanged()
      .debounceTime(this.debounceTime)
      .subscribe((query: string) => {
        this._as.search(query)
          .subscribe((affiliates: Affiliate[]) => this.changeAF$.next(affiliates),
          err => {
            console.error(err);
            return this.changeAF$.next([]);
          });
      });

    return this.changeAF$;
  }
  /**
     * @description Retrieves a list of instructors from the api then listens to value changes
     * on the instructors FormControl and displays filtered results in the auto-complete.
     */
  private subscribeToFacilitatorQuery() {
    const facilitator = this.workshopForm.controls.facilitator;
    facilitator.valueChanges
      .distinctUntilChanged()
      .subscribe(value => {
        if (value && value.length > 2) {
          this.loadingInstructors = true;
          this.facilitatorQueryChange$.next(`${value}*`);
        }
      });

    this.facilitatorValueChanges()
      .subscribe((data: Facilitator[]) => {
        setTimeout(() => this.loadingInstructors = false, 150);
        this.facilitatorOpts = data;
      }, err => console.error(err));
  }


  /**
   * @description Returns a stream of facilitators returned from queries emitted from `this.facilitatorQueryChange$`.
   */
  private facilitatorValueChanges(): BehaviorSubject<Facilitator[]> {
    this.facilitatorQueryChange$.distinctUntilChanged()
      .debounceTime(this.debounceTime)
      .subscribe((query: string) => {
        this._fs.search(query)
          .subscribe((facilitators: Facilitator[]) => {
            return this.facilitatorChange$.next(facilitators);
          }, err => {
            console.error(err);
            return this.facilitatorChange$.next([]);
          });
      });

    return this.facilitatorChange$;
  }

  /**
     * @description Retrieves a list of course managers from the api then listens to value changes
     * on the courseManager FormControl and displays filtered results in the auto-complete.
     */
  private subscribeToCourseManagerQuery() {
    this.workshopForm.get('courseManager')
      .valueChanges
      .distinctUntilChanged()
      .subscribe((query: string) => {
        if (query && query.length > 1) {
          this.loadingCms = true;
          this.courseManagerQuery$.next(`${query}*`);
        }
      });

    this.courseManagerValueChanges()
      .subscribe((cms: CourseManager[]) => {
        setTimeout(() => this.loadingCms = false, 150);
        this.courseManagers = cms;
      });
  }

  /**
   * @description Returns a stream of course managers returned from queries emitted from `this.courseManagerQuery$`.
   */
  private courseManagerValueChanges(): BehaviorSubject<CourseManager[]> {
    const id = this.workshopForm.controls && this.workshopForm.controls.affiliate.value.sfId || this.auth.user.affiliate;
    this.courseManagerQuery$.distinctUntilChanged()
      .debounceTime(this.debounceTime)
      .subscribe((query: string) => {
        this._as.searchCMS(query, id)
          .subscribe((cms: CourseManager[]) => {
            return this.courseManagersChange$.next(cms);
          }, err => {
            console.error(err);
            return this.courseManagersChange$.next([]);
          });
      });
    return this.courseManagersChange$;
  }

  /**
     * @description Retrieves a list of countries from {@link CountriesService} to pick from for the eventCountry FormControl.
     * Listens to value changes of the country FormControl and displays filtered results in the auto-complete.
     */
  private subscribeToCountry() {
    let countryFC = this.workshopForm.get('country');
    countryFC.valueChanges.subscribe(q =>
      this.countryOptions = q ? this.countries.filter(option => new RegExp(`${q}`, 'gi').test(option)) : this.countries
    );

    this._cs.get().subscribe(countries => this.countries = countries, err => console.error(err));
  }

  private subscribeToIsPublic() {
    const publicChanges$ = this.workshopForm.controls.isPublic.valueChanges;
    publicChanges$.subscribe(isPublic => {
      const websiteControl = this.workshopForm.controls.website;

      if (isPublic) websiteControl.setValidators(Validators.required);
      else websiteControl.clearValidators();

      websiteControl.updateValueAndValidity();
    });
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
