import { Component, ViewChild, ElementRef, QueryList, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Workshop, WorkshopType, CourseManager } from "../Workshop";
import { without, merge } from 'lodash';
import { Observable } from "rxjs/Observable";
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from "rxjs/Subject";
import { MdCheckbox, MdAutocomplete, MdAutocompleteTrigger, MdOption, MdOptionSelectionChange } from "@angular/material";
import { Facilitator } from '../../facilitators/Facilitator';
import { FacilitatorService } from '../../facilitators/facilitator.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/onErrorResumeNext';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/throw';

@Component({
  selector: 'app-workshop-form',
  templateUrl: './workshop-form.component.html',
  styleUrls: ['./workshop-form.component.scss']
})
export class WorkshopFormComponent implements OnInit {

  private debounceTime: number = 250;
  private facilitatorQueryChange$ = new Subject<string>();
  private facilitatorChange$ = new BehaviorSubject<Facilitator[]>([]);

  @Input() submitFunction: (Workshop) => Observable<Workshop>;
  @Input('workshop') workshop: Workshop = new Workshop();

  countries: string[] = [];
  countryOptions: string[] = [];
  workshopForm: FormGroup;
  courseManagers: CourseManager[] = [];
  facilitatorOpts: Facilitator[] = [];
  describe: any = {};
  workshopTypes: string[] = ['Discover', 'Enable', 'Improve', 'Align', 'Build'];
  languages: string[] = ['English', 'Spanish', 'German', 'French', 'Mandarin', 'Cantonese', 'Italian', 'Hindi', 'Portuguese (Brazilian)', 'Japanese', 'Dutch', 'Chinese'];

  @ViewChild('autoCourseManager') courseMngrSearch: MdAutocomplete;
  @ViewChild('autoInstructors') facilitatorSearch: MdAutocomplete;

  constructor(public fb: FormBuilder, private router: Router, private _fs: FacilitatorService) { }

  createForm() {
    this.workshopForm = this.fb.group({
      type: [this.workshop.type, Validators.required],
      language: [this.workshop.language],
      public: [this.workshop.isPublic, Validators.required],
      city: [this.workshop.city, Validators.required],
      country: [this.workshop.country, Validators.required],
      hostSite: [this.workshop.hostSite, Validators.required],
      courseManager: [this.workshop.courseManager, [
        Validators.required
      ]],
      startDate: [this.workshop.startDate || new Date().toString(), Validators.required],
      endDate: [this.workshop.endDate || new Date(Date.now() + (1000 * 60 * 60 * 24)).toString(), Validators.required],
      registrationWebsite: [this.workshop.website],
      billingContact: [this.workshop.billing, [
        Validators.required,
        Validators.email
      ]],
      facilitator: new FormControl('')
    });
  }

  ngOnInit() {
    this.createForm();
    this.setupFacilitatorQuery();
  }


  instructorDisplayWith(value: Facilitator) {
    return value ? value.name : '';
  }

  facilitatorChanged(facilitator: Facilitator) {
    console.log('picked fac: ', facilitator);
    this.workshop.addInstructor(facilitator);
    this.workshopForm.controls.facilitator.setValue('');
  }

  /**
     * @description Retrieves a list of instructors from the api then listens to value changes
     * on the instructors FormControl and displays filtered results in the auto-complete.
     */
  setupFacilitatorQuery() {
    const facilitator = this.workshopForm.controls.facilitator;

    facilitator.valueChanges
      .distinctUntilChanged()
      .subscribe(value => {
        if (value && value.length > 2)
          this.facilitatorQueryChange$.next(`${value}*`);
      });

    this.facilitatorValueChanges().subscribe((data: Facilitator[]) => {
      this.facilitatorOpts = data;
    }, err => { console.error(err); });
  }

  /**
   * @description Returns a stream of facilitators returned from queries emitted from `this.facilitatorQueryChange$`.
   */
  facilitatorValueChanges(): BehaviorSubject<Facilitator[]> {
    this.facilitatorQueryChange$.distinctUntilChanged()
      .debounceTime(this.debounceTime)
      .subscribe((query: string) => {
        this._fs.search(query).subscribe((fac: Facilitator[]) => {
          return this.facilitatorChange$.next(fac);
        });
      });

    return this.facilitatorChange$;
  }

}
