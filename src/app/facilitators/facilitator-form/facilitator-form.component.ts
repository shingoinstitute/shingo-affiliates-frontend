import { Component, Inject, OnInit, Input, Optional, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators, ValidatorFn, FormBuilder } from '@angular/forms';

import { Facilitator, FacilitatorRoleType } from '../facilitator.model';
import { FacilitatorService } from '../../services/facilitator/facilitator.service';
import { Affiliate } from '../../affiliates/affiliate.model';
import { Observable } from 'rxjs/Observable';

declare var $: any;

@Component({
  selector: 'app-facilitator-form',
  templateUrl: './facilitator-form.component.html',
  styleUrls: ['./facilitator-form.component.scss']
})
export class FacilitatorFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('facilitator') public facilitator: Facilitator = new Facilitator();
  @Input('isDialog') public isDialog: boolean;

  @ViewChild('formContainer') public formContainer: ElementRef;

  public formGroup: FormGroup;
  public isValid: boolean = false;
  public isLoading: boolean;
  public isSearching: boolean;
  public facilitatorsOpts: Facilitator[] = [];
  public roles: FacilitatorRoleType[] = Facilitator.DEFAULT_ROLE_OPTIONS;
  public didSelectExistingSFContact: boolean;

  public routeSubscription;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public snackbar: MatSnackBar,
    public _fs: FacilitatorService,
    public location: Location,
    public route: ActivatedRoute,
    public fb: FormBuilder
  ) {
    this.buildForm();

    if (this.data) {
      this.isDialog = this.data.isDialog;
      this.facilitator = this.data.facilitator;
    }
  }

  public ngOnInit() {
    // check route params for facilitator's sfId
    this.routeSubscription = this.route.params.subscribe((route) => {
      const id = route['id'];
      if (typeof id === 'string' && id !== 'create') {
        this.getSFObject(id);
      }
    });
  }

  public ngAfterViewInit() {
    // center element in container if it's not a dialog box
    if (!this.isDialog) {
      $(this.formContainer.nativeElement).css('margin', '0 auto');
      $(this.formContainer.nativeElement).css('margin-bottom', '48px');
    }
  }

  public ngOnDestroy() {
    if (this.routeSubscription) this.routeSubscription.unsubscribe();
  }

  public getSFObject(id: string) {
    this.isLoading = true;
    this._fs.getById(id).subscribe((facilitator: Facilitator) => {
      this.isLoading = false;
      if (facilitator) {
        this.facilitator = facilitator;
        this.formGroup.patchValue(this.facilitator);
        this.formGroup.controls.email.patchValue({ 'sfObject': this.facilitator });
        this.formGroup.controls.affiliate.patchValue({ 'sfObject': this.facilitator.affiliate });
        this.formGroup.updateValueAndValidity();
        this.checkForAffiliate();
      }
    }, err => {
      console.error(err);
      this.isLoading = false;
      this.snackbar.open('A server error occurred and the facilitator could not be loaded.', 'Okay');
    });
  }

  public buildForm() {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      title: [''],
      photo: [''],
      role: ['', Validators.required],
      affiliate: [new Affiliate(), Validators.required]
    });


    this.checkForAffiliate();
  }

  /**
   * @desc onSelectFacilitator is invoked when a user is selected from the sf-lookup-field on the facilitator form
   * @param {Facilitator} f: the facilitator object the user selected
   */
  public onSelectFacilitator(f: Facilitator) {
    if (f && f instanceof Facilitator) {
      this.facilitator = f;
      this.formGroup.controls.affiliate.patchValue({ 'sfObject': f.affiliate });
      this.formGroup.controls.affiliate.updateValueAndValidity();
      this.didSelectExistingSFContact = true;
      this.checkForAffiliate();
    }
  }

  public onSelectAffiliate(affiliate: Affiliate) {
    if (affiliate) {
      this.facilitator.affiliate = affiliate;
      this.checkForAffiliate();
    } else {
      this.disabledRoleField();
    }
  }

  public onSave() {
    this.snackbar.open('Saving Changes...');
    if (this.didSelectExistingSFContact) {
      this.map();
    } else if (!this.facilitator.sfId.length) {
      this.create();
    } else {
      this.update();
    }
  }

  public update() {
    this.isLoading = true;
    this._fs.update(this.facilitator).subscribe(data => {
      this.isLoading = false;
      this.snackbar.open('Update Successful', null, { duration: 2000 });
      this.location.back();
    }, err => {
      this.isLoading = false;
      this.handleError(err);
    });
  }

  public create() {
    this.isLoading = true;
    this._fs.create(this.facilitator).subscribe(data => {
      this.isLoading = false;
      this.snackbar.open('Successfully Created New Facilitator.', null, { duration: 2000 });
      this.location.back();
    }, err => {
      console.error('', err);
      this.isLoading = false;
      this.snackbar.open('Failed to create new facilitator. Make sure you are not trying to create a duplicate facilitator.', 'Okay');
    });
  }

  public map() {
    this.isLoading = true;
    this._fs.map(this.facilitator).subscribe(data => {
      this.isLoading = false;
      this.snackbar.open('Successfully Created New Facilitator.', null, { duration: 2000 });
      this.location.back();
    }, err => {
      console.error('', err);
      this.isLoading = false;
      this.snackbar.open('Failed to create new facilitator. Make sure you are not trying to create a duplicate facilitator.', 'Okay');
    });
  }

  public displayFn(obj: Facilitator | Affiliate | string): string {
    if (obj instanceof Facilitator) return obj.email;
    else if (obj instanceof Affiliate) return obj.name;
    else if (typeof obj === 'string') return obj;
    else return '';
  }

  public handleError(err: any) {
    console.error('Error in FacilitatorFormComponent: ', err);
    this.snackbar.open('An error occured and the requested operation could not be complete.', 'Okay');
  }

  public checkForAffiliate() {
    try {
      this.facilitator.affiliate.sfId === '' ? this.disabledRoleField() : this.enableRoleField();
    } catch (e) {
      this.disabledRoleField();
    }
  }

  public enableRoleField() {
    const control = this.formGroup.get('role');
    if (control) control.enable();
  }

  public disabledRoleField() {
    const control = this.formGroup.get('role');
    if (control) control.disable();
  }

}
