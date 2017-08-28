import { Component, OnInit, Input, Inject, Optional, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { Affiliate } from '../Affiliate';
import { MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { AffiliateService } from '../../services/affiliate/affiliate.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-affiliate-form',
  templateUrl: './affiliate-form.component.html',
  styleUrls: ['./affiliate-form.component.scss']
})
export class AffiliateFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('affiliate') affiliate: Affiliate;

  @ViewChild('formContainer') formContainer: ElementRef;

  private extraFields: string[] = ['Public_Contact__c', 'Public_Contact_Email__c', 'Public_Contact_Phone__c', 'Summary__c'];

  private state: AffiliateFormState;
  langControl: FormControl;
  languages: string[] = Affiliate.DEFAULT_LANGUAGE_OPTIONS;
  languageOptions: any;
  isLoading: boolean;

  private isDialog: boolean;
  private routeSubscription;

  constructor(
    @Optional() @Inject(MD_DIALOG_DATA) public data: any,
    private _as: AffiliateService,
    private snackbar: MdSnackBar,
    private location: Location,
    private route: ActivatedRoute
  ) {
    this.langControl = new FormControl();
    this.languageOptions = this.langControl.valueChanges.map(val => this.filterLanguages(val));
  }

  ngOnInit() {
    if (this.data) {
      this.isDialog = this.data.isDialog;
      this.affiliate = this.data.affiliate;
    }

    if (!this.affiliate) {
      this.state = new AffiliateFormState(State.Creating);
      this.affiliate = new Affiliate();
      this.routeSubscription = this.route.params.subscribe((route) => {
        const id = route['id'];
        if (typeof id === 'string' && id !== 'create') {
          this.getSFObject(id);
        }
      });
    } else {
      this.state = new AffiliateFormState(State.Updating);
    }
  }

  ngAfterViewInit() {
    // center element if it's not a dialog box
    if (!this.isDialog) {
      $(this.formContainer.nativeElement).css('margin', '0 auto');
    }
  }

  selectedAffiliate(affiliate: Affiliate) {
    this.affiliate = affiliate;
    this.state.next();
  }

  ngOnDestroy() {
    this.routeSubscription && this.routeSubscription.unsubscribe();
  }

  getSFObject(id: string) {
    this.isLoading = true;
    this._as.getById(id).subscribe((affiliate: Affiliate) => {
      this.affiliate = affiliate ? affiliate : new Affiliate();
      this.isLoading = false;
    }, err => {
      console.error(err);
      this.isLoading = false;
    });
  }

  filterLanguages(val: string) {
    return val ? this.languages.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0) : this.languages;
  }

  onSelectLanguage(lang: string) {
    this.affiliate.addLanguage(lang);
    this.langControl.setValue(null);
  }

  removeLanguage(lang: string) {
    this.affiliate.removeLangauge(lang);
  }

  onClickSave() {
    this.snackbar.open('Saving Changes...');
    switch (this.state.state) {
      case State.Creating: this.create(); break;
      case State.Mapping: this.map(); break;
      case State.Updating: this.update(); break;
    }
  }

  map() {
    this._as.map(this.affiliate).subscribe(data => {
      this.snackbar.open('Successfully mapped a new Affiliate', null, { duration: 2000 });
      if (!this.isDialog) { this.location.back(); }
    }, err => {
      this.handleError(err);
    });
  }

  create() {
    this._as.create(this.affiliate).subscribe(data => {
      this.snackbar.open('Successfully created new Affiliate', null, { duration: 2000 });
      if (!this.isDialog) {
        this.location.back();
      }
    }, err => {
      this.handleError(err);
    });
  }

  update() {
    this._as.update(this.affiliate).subscribe(data => {
      this.snackbar.open('Update Successful', null, { duration: 2000 });
      if (!this.isDialog) {
        this.location.back();
      }
    }, err => {
      this.handleError(err);
    });
  }

  handleError(err: any) {
    console.error(err);
    this.snackbar.open('An error occurred and the requested operation could not be completed.', 'Okay');
  }

}


enum State { Creating = 1, Mapping = 2, Updating = 3 }
class AffiliateFormState {
  private _state: State;

  public get state(): State { return this._state; }

  constructor(state: State.Creating | State.Updating) { this._state = state; }

  next() {
    switch (this._state) {
      case State.Creating: this._state = State.Mapping; break;
      default: break;
    }
  }
}
