import { Component, OnInit, Input, Inject, Optional, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MD_DIALOG_DATA, MdSnackBar } from '@angular/material';

import { Affiliate } from '../affiliate.model';
import { AffiliateService } from '../../services/affiliate/affiliate.service';
import { AffiliateFormState, State } from './affiliate-form-state.class';

import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-affiliate-form',
  templateUrl: './affiliate-form.component.html',
  styleUrls: ['./affiliate-form.component.scss']
})
export class AffiliateFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('affiliate') public affiliate: Affiliate;

  @ViewChild('formContainer') private formContainer: ElementRef;

  private extraFields: string[] = ['Public_Contact__c', 'Public_Contact_Email__c', 'Public_Contact_Phone__c', 'Summary__c'];

  private state: AffiliateFormState;
  private langControl: FormControl;
  private languages: string[] = Affiliate.DEFAULT_LANGUAGE_OPTIONS;
  private languageOptions: any;
  private isLoading: boolean;
  private isDialog: boolean;
  private routeSubscription: Subscription;

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

  public ngOnInit() {
    if (this.data) {
      this.isDialog = this.data.isDialog;
      this.affiliate = this.data.affiliate;
    }

    if (!this.affiliate) {
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

  private selectedAffiliate(affiliate: Affiliate) {
    this.affiliate = affiliate;
    this.state.next();
  }

  private getSFObject(id: string) {
    this.isLoading = true;
    this._as.getById(id).subscribe((affiliate: Affiliate) => {
      this.affiliate = affiliate ? affiliate : new Affiliate();
      this.isLoading = false;
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
    this.langControl.setValue(null);
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

}
