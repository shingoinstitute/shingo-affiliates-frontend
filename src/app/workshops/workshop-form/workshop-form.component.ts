import { Component, ViewChild, ElementRef, QueryList, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Workshop, WorkshopType, CourseManager } from "../Workshop";
import { without, merge } from 'lodash';
import { Observable } from "rxjs/Observable";
import { Subscription } from 'rxjs/Subscription';
import { MdCheckbox, MdAutocomplete, MdAutocompleteTrigger, MdOption, MdOptionSelectionChange } from "@angular/material";
import { Facilitator } from "../../facilitators/Facilitator";
import 'rxjs/add/observable/merge';

@Component({
  selector: 'app-workshop-form',
  templateUrl: './workshop-form.component.html',
  styleUrls: ['./workshop-form.component.scss']
})
export class WorkshopFormComponent implements OnInit {
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

  sub: Subscription;

  @ViewChild('autoCourseManager') courseMngrSearch: MdAutocomplete;
  @ViewChild('autoInstructors') facilitatorSearch: MdAutocomplete;
  @ViewChild(MdAutocompleteTrigger) trigger: MdAutocompleteTrigger;

  constructor(public fb: FormBuilder, private router: Router) { }

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
      ]]
    });
  }

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit() {
    this.sub = Observable.merge(this.trigger.optionSelections).subscribe(option => console.log('option', option));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  instructorDisplayWith(value: Facilitator) {
    return value ? value.toString() : '';
  }

}
