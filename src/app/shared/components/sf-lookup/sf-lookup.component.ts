
import {distinctUntilChanged, debounceTime, filter} from 'rxjs/operators';
import { Observable ,  Subject } from 'rxjs';
import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormBuilder, Validators } from '@angular/forms';

import { SFObject } from '../../models/sf-object.abstract.model';
import { Affiliate } from '../../../affiliates/affiliate.model';
import { AffiliateService, DEFAULT_AFFILIATE_SEARCH_FIELDS } from '../../../services/affiliate/affiliate.service';

import { Facilitator } from '../../../facilitators/facilitator.model';
import { FacilitatorService } from '../../../services/facilitator/facilitator.service';

import { Workshop } from '../../../workshops/workshop.model';
import { WorkshopService } from '../../../services/workshop/workshop.service';
import { CourseManager } from '../../../workshops/course-manager.model';

import { ValidationErrors } from '@angular/forms/src/directives/validators';

@Component({
  selector: 'app-sf-lookup',
  templateUrl: './sf-lookup.component.html',
  styleUrls: ['./sf-lookup.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: SfLookupComponent },
    { provide: NG_VALIDATORS, multi: true, useExisting: SfLookupComponent }
  ]
})
export class SfLookupComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  @Input() public sfObject: SFObject | 'facilitator' | 'affiliate' | 'workshop' | 'courseManager';
  @Input() public placeholder: string;
  @Input() public fields: string[];
  @Input() public extraArgs: any;
  @Input() public displayFn: (o: SFObject) => string;

  // Should the lookup component input field be required?
  @Input() public isRequired: boolean = true;

  @Output() public onSelect = new EventEmitter<SFObject>();
  @Output() public onChange = new EventEmitter<string>();

  public lookup: FormGroup;

  public objects: SFObject[] = [];
  public isSearching: boolean = false;

  public queryHandlerSource = new Subject<string>();
  public queryHandler: Observable<string> = this.queryHandlerSource.asObservable();

  constructor(public _as: AffiliateService, public _fs: FacilitatorService, public _ws: WorkshopService, public fb: FormBuilder) { }

  public writeValue(value: any): void {
    if (value) this.lookup.patchValue(value);
  }

  public registerOnChange(fn: any): void {
    this.lookup.valueChanges.subscribe(fn);
  }

  public registerOnTouched(fn: any): void {
    this.registerOnChange(fn);
  }

  public setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  public ngOnInit() {

    this.lookup = this.fb.group({
      sfObject: [this.sfObject]
    });
    if (this.placeholder === undefined) this.placeholder = 'Search...';
    if (typeof this.sfObject === 'string') {
      switch (this.sfObject) {
        case 'facilitator':
          this.sfObject = new Facilitator();
          break;
        case 'affiliate':
          this.sfObject = new Affiliate();
          break;
        case 'workshop':
          this.sfObject = new Workshop();
          break;
        case 'courseManager':
          this.sfObject = new CourseManager();
          break;
      }
    }
  }

  public validate(control: FormControl) {
    return this.lookup.valid ? null : this.reduceErrors();
  }

  public ngAfterViewInit() {
    // If `this.isRequired` is true, add the isRequired validator to the FormControl
    if (this.isRequired) {
      // Get the FormControl object
      const sfObjectFormControl = this.lookup.get('sfObject');
      // Add the validator to the FormControl
      sfObjectFormControl.setValidators([Validators.required]);
    }


    this.lookup.controls.sfObject.valueChanges.pipe(
      filter(query => query && query.length > 2))
      .subscribe(query => this.queryHandlerSource.next(query));

    this.queryHandler.pipe(
      debounceTime(250),
      distinctUntilChanged(),)
      .subscribe(query => {
        this.handleQuery(query);
      });
  }

  public handleQuery(query: string) {
    if (query && query.length > 2) {
      this.isSearching = true;
      this.onChange.emit(query);

      // let searchFn: Observable<SFObject[]>;
      let searchFn: Observable<SFObject[]> = this._as.search(query, DEFAULT_AFFILIATE_SEARCH_FIELDS);

      if (this.sfObject instanceof Affiliate) {
        if (!this.fields || !this.fields.length) this.fields = DEFAULT_AFFILIATE_SEARCH_FIELDS;
        searchFn = this._as.search(query, this.fields);
      } else if (this.sfObject instanceof Facilitator) {
        searchFn = this._fs.search(query, this.fields, this.extraArgs);
      } else if (this.sfObject instanceof Workshop) {
        searchFn = this._ws.search(query);
      } else if (this.sfObject instanceof CourseManager) {
        searchFn = this._as.searchCMS(query, this.extraArgs);
      }

      if (!searchFn) {
        throw new Error(`Cannot determine a search function for ${typeof this.sfObject}`);
      }

      searchFn.subscribe((data: SFObject[]) => {
        this.isSearching = false;
        this.objects = data.map(o => o).sort((a: SFObject, b: SFObject) => {
          return a.name > b.name ? 1 : -1;
        });
      }, err => {
        this.isSearching = false;
        console.error(err);
      });
    }
  }

  public onSelectChange(sfObject: SFObject) {
    this.sfObject = sfObject;
    this.onSelect.emit(sfObject);

    // If 'sfObject' inside the lookupForm is not required (as determined by `this.isRequired`)
    // then clear the form when an item is selected.
    if (!this.isRequired) {
      // Get the FormControl from the lookup FormGroup
      const sfObjectFormControl = this.lookup.get('sfObject');
      // Set the FormControl value to '' to clear it
      sfObjectFormControl.setValue('');
    }

  }

  public reduceErrors() {
    return Object.keys(this.lookup.controls).reduce((errors: any, name: string) => {
      errors[name] = this.lookup.get(name).errors;
      return errors;
    }, {});
  }

  public displayObjFn(obj: any): string {
    if (obj instanceof Facilitator)
      return `<div class="search-holder">
        ${obj.photo !== '' ? '<img class="thumbnail-search profile" src="' + obj.photo + '" />' : ''}
        ${obj.name}${obj.email !== '' ? '&nbsp;:<span class="small-light-text">&emsp;' + obj.email : ''}</span>
      </div>`;
    else if (obj instanceof Affiliate)
      return `<div class="search-holder">
        ${obj.logo !== '' ? '<img class="thumbnail-search" src="' + obj.logo + '" />' : ''}
        ${obj.name}${obj.summary === null || obj.summary === 'null' || obj.summary === ''
        ? '' : '&nbsp;:<span class="small-light-text">&emsp;' + this.truncate(obj.summary.replace(/(<([^>]+)>)/ig, ''), 25)}</span>
      </div>`;
    else if (obj instanceof CourseManager)
      return `<div class="search-holder">
        ${obj.name}${obj.email !== '' ? '&nbsp;:<span class="small-light-text">&emsp;' + obj.email : ''}</span>
      </div>`;
    else if (typeof obj.name !== 'undefined') return obj.name;
    else if (typeof obj.email !== 'undefined') return obj.name;
    else if (typeof obj === 'string') return obj;
    else return `Parsing Error!`;
  }

  private truncate(str:  string, len: number, postfix: string = '...'): string {
    if (str.length <= len) return str;
    return str.substr(0, len) + postfix;
  }
}
