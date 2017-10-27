import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormBuilder, Validators } from '@angular/forms';

import { SFObject } from '../../models/sf-object.abstract.model';
import { Affiliate } from '../../../affiliates/affiliate.model';
import { AffiliateService } from '../../../services/affiliate/affiliate.service';

import { Facilitator } from '../../../facilitators/facilitator.model';
import { FacilitatorService } from '../../../services/facilitator/facilitator.service';

import { Workshop } from '../../../workshops/workshop.model';
import { WorkshopService } from '../../../services/workshop/workshop.service';
import { CourseManager } from '../../../workshops/course-manager.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import { Subject } from 'rxjs/Subject';

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
      sfObject: [this.sfObject, Validators.required]
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
    this.lookup.controls.sfObject.valueChanges
      .filter(query => query && query.length > 2)
      .subscribe(query => this.queryHandlerSource.next(query));

    this.queryHandler
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(query => {
        this.handleQuery(query);
      });
  }

  public handleQuery(query: string) {
    if (query && query.length > 2) {
      this.isSearching = true;
      this.onChange.emit(query);

      let searchFn: Observable<SFObject[]>;

      if (this.sfObject instanceof Affiliate) {
        searchFn = this._as.search(query);
      } else if (this.sfObject instanceof Facilitator) {
        searchFn = this._fs.search(query, this.fields, this.extraArgs);
      } else if (this.sfObject instanceof Workshop) {
        searchFn = this._ws.search(query);
      } else if (this.sfObject instanceof CourseManager) {
        searchFn = this._as.searchCMS(query, this.extraArgs);
      } else {
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
  }

  public reduceErrors() {
    return Object.keys(this.lookup.controls).reduce((errors: any, name: string) => {
      errors[name] = this.lookup.get(name).errors;
      return errors;
    }, {});
  }

  public displayObjFn(obj: any): string {
    if (obj instanceof Facilitator) return obj.email;
    else if (obj instanceof Affiliate) return obj.name;
    else if (obj instanceof CourseManager) return obj.name;
    else if (typeof obj.name !== 'undefined') return obj.name;
    else if (typeof obj.email !== 'undefined') return obj.name;
    else if (typeof obj === 'string') return obj;
    else return `Parsing Error!`;
  }

}
