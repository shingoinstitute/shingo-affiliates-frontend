import { Component, OnInit, Input, Inject, Optional, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MD_DIALOG_DATA, MdSnackBar } from '@angular/material';

import { Affiliate } from '../affiliate.model';
import { AffiliateService } from '../../services/affiliate/affiliate.service';
import { AffiliateFormState, State } from './affiliate-form-state.class';

import { Subscription } from 'rxjs/Rx';
import { CustomValidators } from 'ng2-validation';

// tslint:disable-next-line:prefer-const
let $: any;

@Component({
  selector: 'app-affiliate-form',
  templateUrl: './affiliate-form.component.html',
  styleUrls: ['./affiliate-form.component.scss']
})
export class AffiliateFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('affiliate') public affiliate: Affiliate = new Affiliate();

  @ViewChild('formContainer') private formContainer: ElementRef;

  private extraFields: string[] = ['Public_Contact__c', 'Public_Contact_Email__c', 'Public_Contact_Phone__c', 'Summary__c'];

  private state: AffiliateFormState;
  private languages: string[] = Affiliate.DEFAULT_LANGUAGE_OPTIONS;
  private languageOptions: any;
  private isLoading: boolean;
  private isDialog: boolean;
  private routeSubscription: Subscription;
  private affForm: FormGroup;

  constructor(
    @Optional() @Inject(MD_DIALOG_DATA) public data: any,
    private _as: AffiliateService,
    private snackbar: MdSnackBar,
    private location: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder
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


  private buildForm() {
    this.affForm = this.fb.group({
      affiliate: [this.affiliate || new Affiliate(), Validators.required],
      logo: [this.affiliate.logo],
      website: [this.affiliate.website, CustomValidators.url],
      publicContact: [this.affiliate.publicContact],
      publicContactEmail: [this.affiliate.publicContactEmail, Validators.email],
      publicContactPhone: [this.affiliate.publicContactPhone],
      langControl: [''],
      summary: [this.affiliate.summary]
    });
  }

  private selectedAffiliate(affiliate: Affiliate) {
    this.affiliate = affiliate;
    this.state.next();
  }

  private getSFObject(id: string) {
    this.isLoading = true;
    this._as.getById(id).subscribe((affiliate: Affiliate) => {
      this.affiliate = affiliate ? affiliate : new Affiliate();
      this.affForm.patchValue({
        logo: this.affiliate.logo,
        website: this.affiliate.website,
        publicContact: this.affiliate.publicContact,
        publicContactEmail: this.affiliate.publicContactEmail,
        publicContactPhone: this.affiliate.publicContactPhone,
        summary: this.affiliate.summary
      });
      this.affForm.controls.affiliate.patchValue({ 'sfObject': this.affiliate });
      this.isLoading = false;
      this.languageOptions = this.affForm.controls.langControl.valueChanges.map(val => this.filterLanguages(val));
    }, err => {
      console.error(err);
      this.isLoading = false;
    });
  }

  private filterLanguages(val: string) {
    return val ? this.languages.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0) : this.languages;
  }

  private onSelectLanguage(lang: string) {
    this.affiliate.addLanguage(lang);
    this.affForm.controls.langControl.setValue(null);
  }

  private removeLanguage(lang: string) {
    this.affiliate.removeLangauge(lang);
  }

  private onSave() {
    this.snackbar.open('Saving Changes...');
    switch (this.state.state) {
      case State.Creating: this.create(); break;
      case State.Mapping: this.map(); break;
      case State.Updating: this.update(); break;
    }
  }

  private map() {
    this._as.map(this.affiliate).subscribe(data => {
      this.snackbar.open('Successfully mapped a new Affiliate', null, { duration: 2000 });
      if (!this.isDialog) { this.location.back(); }
    }, err => {
      this.handleError(err);
    });
  }

  private create() {
    this._as.create(this.affiliate).subscribe(data => {
      this.snackbar.open('Successfully created new Affiliate', null, { duration: 2000 });
      if (!this.isDialog) {
        this.location.back();
      }
    }, err => {
      this.handleError(err);
    });
  }

  private update() {
    this._as.update(this.affiliate).subscribe(data => {
      this.snackbar.open('Update Successful', null, { duration: 2000 });
      if (!this.isDialog) {
        this.location.back();
      }
    }, err => {
      this.handleError(err);
    });
  }

  private handleError(err: any) {
    console.error(err);
    this.snackbar.open('An error occurred and the requested operation could not be completed.', 'Okay');
  }

  private displayFn(affilate: Affiliate) {
    return affilate ? affilate.name : '';
  }

}
