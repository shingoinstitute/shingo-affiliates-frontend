import { Component, OnInit, Input, Inject, Optional, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { Affiliate } from '../affiliate.model';
import { AffiliateService, DEFAULT_AFFILIATE_SEARCH_FIELDS } from '../../services/affiliate/affiliate.service';
import { AffiliateFormState, State } from './affiliate-form-state.class';

import { Subscription } from 'rxjs/Rx';
import { CustomValidators } from 'ng2-validation';


// Lodash functions
import { merge } from 'lodash';

declare var $: any;

@Component({
  selector: 'app-affiliate-form',
  templateUrl: './affiliate-form.component.html',
  styleUrls: ['./affiliate-form.component.scss']
})
export class AffiliateFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('affiliate') public affiliate: Affiliate = new Affiliate();

  @ViewChild('formContainer') public formContainer: ElementRef;

  public extraFields: string[] = ['Public_Contact__c', 'Public_Contact_Email__c', 'Public_Contact_Phone__c'].concat(DEFAULT_AFFILIATE_SEARCH_FIELDS);

  public state: AffiliateFormState;
  public languages: string[] = Affiliate.DEFAULT_LANGUAGE_OPTIONS;
  public languageOptions: any;
  public isLoading: boolean;
  public isDialog: boolean;
  public routeSubscription: Subscription;
  public affForm: FormGroup;
  public affiliateSummary: string;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public _as: AffiliateService,
    public snackbar: MatSnackBar,
    public location: Location,
    public route: ActivatedRoute,
    public fb: FormBuilder
  ) {

    this.buildForm();
    this.languageOptions = this.affForm.controls.langControl.valueChanges.map(val => this.filterLanguages(val));
  }

  public ngOnInit() {
    if (this.data) {
      this.isDialog = this.data.isDialog;
      this.affiliate = this.data.affiliate;
    }

    if (!this.affiliate.sfId) {
      this.affiliate = new Affiliate();
      this.routeSubscription = this.route.params.subscribe((route) => {
        const id = route['id'];
        if (typeof id === 'string' && id !== 'create') {
          this.getSFObject(id);
          this.state = new AffiliateFormState(State.Updating);
        } else {
          this.state = new AffiliateFormState(State.Creating);
        }
      });
    }
  }

  public ngAfterViewInit() {
    // center element if it's not a dialog box
    if (!this.isDialog) {
      $(this.formContainer.nativeElement).css('margin', '0 auto');
    }
  }

  public ngOnDestroy() {
    if (this.routeSubscription) this.routeSubscription.unsubscribe();
  }


  public buildForm() {
    this.affForm = this.fb.group({
      affiliate: [this.affiliate || new Affiliate(), Validators.required],
      logo: [this.affiliate.logo],
      website: [this.affiliate.website, CustomValidators.url],
      publicContact: [this.affiliate.publicContact],
      publicContactEmail: [this.affiliate.publicContactEmail, Validators.email],
      publicContactPhone: [this.affiliate.publicContactPhone],
      langControl: ['']
    });
  }

  public selectedAffiliate(affiliate: Affiliate) {
    this.affiliate = affiliate;
    this.affForm.patchValue({
      logo: this.affiliate.logo,
      website: this.affiliate.website,
      publicContact: this.affiliate.publicContact,
      publicContactEmail: this.affiliate.publicContactEmail,
      publicContactPhone: this.affiliate.publicContactPhone
    });
    this.state.next();
  }

  public getSFObject(id: string) {
    this.isLoading = true;
    this._as.getById(id).subscribe((affiliate: Affiliate) => {
      this.affiliate = affiliate ? affiliate : new Affiliate();
      this.affForm.patchValue({
        logo: this.affiliate.logo,
        website: this.affiliate.website,
        publicContact: this.affiliate.publicContact,
        publicContactEmail: this.affiliate.publicContactEmail,
        publicContactPhone: this.affiliate.publicContactPhone
      });
      this.affForm.controls.affiliate.patchValue({ 'sfObject': this.affiliate });
      this.isLoading = false;
      this.languageOptions = this.affForm.controls.langControl.valueChanges.map(val => this.filterLanguages(val));
    }, err => {
      console.error(err);
      this.isLoading = false;
    });
  }

  public filterLanguages(val: string) {
    return val ? this.languages.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0) : this.languages;
  }

  public onSelectLanguage(lang: string) {
    this.affiliate.addLanguage(lang);
    this.affForm.controls.langControl.setValue(null);
  }

  public removeLanguage(lang: string) {
    this.affiliate.removeLangauge(lang);
  }

  public onSave() {
    this.snackbar.open('Saving Changes...');
    merge(this.affiliate, this.affForm.value);
    switch (this.state.state) {
      case State.Creating: this.create(); break;
      case State.Mapping: this.map(); break;
      case State.Updating: this.update(); break;
    }
  }

  public map() {
    this._as.map(this.affiliate).subscribe(data => {
      this.snackbar.open('Successfully mapped a new Affiliate', null, { duration: 2000 });
      if (!this.isDialog) { this.location.back(); }
    }, err => {
      this.handleError(err);
    });
  }

  public create() {
    this._as.create(this.affiliate).subscribe(data => {
      this.snackbar.open('Successfully created new Affiliate', null, { duration: 2000 });
      if (!this.isDialog) {
        this.location.back();
      }
    }, err => {
      this.handleError(err);
    });
  }

  public update() {
    this._as.update(this.affiliate).subscribe(data => {
      this.snackbar.open('Update Successful', null, { duration: 2000 });
      if (!this.isDialog) {
        this.location.back();
      }
    }, err => {
      this.handleError(err);
    });
  }

  public handleError(err: any) {
    console.error(err);
    this.snackbar.open('An error occurred and the requested operation could not be completed.', 'Okay');
  }

  public displayFn(affilate: Affiliate) {
    return affilate ? affilate.name : '';
  }

}
