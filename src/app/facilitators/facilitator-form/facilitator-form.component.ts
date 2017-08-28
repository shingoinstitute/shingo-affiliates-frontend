import { Component, Inject, OnInit, Input, Optional, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { MD_DIALOG_DATA, MdSnackBar } from "@angular/material";
import { FormGroup, FormControl, Validators, ValidatorFn } from "@angular/forms";

import { Facilitator } from "../Facilitator";
import { FacilitatorService } from "../../services/facilitator/facilitator.service";
import { Affiliate } from "../../affiliates/Affiliate";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-facilitator-form',
  templateUrl: './facilitator-form.component.html',
  styleUrls: ['./facilitator-form.component.scss']
})
export class FacilitatorFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('facilitator') facilitator: Facilitator = new Facilitator();
  @Input('isDialog') isDialog: boolean;

  @ViewChild('formContainer') formContainer: ElementRef;

  formGroup: FormGroup;
  isValid: boolean = false;
  isLoading: boolean;
  isSearching: boolean;
  facilitatorsOpts: Facilitator[] = [];
  roles = Facilitator.DEFAULT_ROLE_OPTIONS;
  private isNewFacilitator: boolean;

  private routeSubscription;

  constructor(
    @Optional() @Inject(MD_DIALOG_DATA) public data: any,
    private snackbar: MdSnackBar,
    private _fs: FacilitatorService,
    private location: Location,
    private route: ActivatedRoute
  ) {
    this.buildForm();

    if (this.data) {
      this.isDialog = this.data.isDialog;
      this.facilitator = this.data.facilitator;
    }
  }

  ngOnInit() {
    // check route params for facilitator's sfId
    this.routeSubscription = this.route.params.subscribe((route) => {
      const id = route['id'];
      if (typeof id === 'string' && id !== 'create') {
        this.getSFObject(id);
      }
    });
  }

  ngAfterViewInit() {
    // center element in container if it's not a dialog box
    if (!this.isDialog) {
      $(this.formContainer.nativeElement).css('margin', '0 auto');
      $(this.formContainer.nativeElement).css('margin-bottom', '48px');
    }

    this.facilitatorSearch();
  }

  ngOnDestroy() {
    this.routeSubscription && this.routeSubscription.unsubscribe();
  }

  /**
   * @desc listens to changes on email formControl to populate values in `this.facilitatorOpts`
   * 
   * NOTE: facilitatorSearch only returns unmapped facilitators
   */
  facilitatorSearch() {
    this.formGroup.get('email').valueChanges
      .skip(1)
      .filter(email => {
        return email && email.length > 2;
      })
      .debounceTime(250)
      .subscribe(email => {
        this.isSearching = true;
        this._fs.search(email, false).subscribe((facilitators: Facilitator[]) => {
          this.facilitatorsOpts = facilitators;
          this.checkForAffiliate();
          this.isSearching = false;
          this.isNewFacilitator = true;
        }, err => {
          console.error(err);
          this.isSearching = false;
        });
      });
  }

  getSFObject(id: string) {
    this.isLoading = true;
    this._fs.getById(id).subscribe((facilitator: Facilitator) => {
      this.isLoading = false;
      if (facilitator) {
        this.facilitator = facilitator;
        this.checkForAffiliate();
      }
    }, err => {
      console.error(err);
      this.isLoading = false;
      this.snackbar.open('A server error occurred and the facilitator could not be loaded.', 'Okay');
    });
  }

  buildForm() {
    this.formGroup = new FormGroup({
      email: new FormControl(Validators.required),
      firstName: new FormControl(Validators.required),
      lastName: new FormControl(Validators.required),
      title: new FormControl(),
      photo: new FormControl(),
      role: new FormControl(Validators.required),
      affiliate: new FormControl(Validators.required)
    });

    this.checkForAffiliate();
  }

  onSelectFacilitator(f: Facilitator) {
    if (f && f instanceof Facilitator) {
      this.facilitator = f;
    }
  }

  onSelectAffiliate(affiliate: Affiliate) {
    if (affiliate) {
      this.facilitator.affiliate = affiliate;
      this.checkForAffiliate()
    } else {
      this.disabledRoleField();
    }
  }

  onClickSave() {
    this.snackbar.open('Saving Changes...');
    if (this.isNewFacilitator) {
      this.map();
    } else if (this.facilitator.sfId === '') {
      this.create();
    } else {
      this.update();
    }
  }

  update() {
    this.isLoading = true;
    this._fs.update(this.facilitator).subscribe(data => {
      this.isLoading = false;
      this.snackbar.open('Update Successful', null, { duration: 2000 });
      this.location.back();
    }, err => {
      this.handleError(err);
    });
  }

  create() {
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

  map() {
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

  displayFn(facilitator: Facilitator | string): string {
    if (facilitator instanceof Facilitator) {
      return facilitator.email;
    } else if (typeof facilitator === 'string') {
      return facilitator;
    } else {
      return '';
    }
  }

  handleError(err: any) {
    console.error('', err);
    this.snackbar.open('An error occured and the requested operation could not be complete.', 'Okay');
  }

  private checkForAffiliate() {
    try {
      this.facilitator.affiliate.sfId === '' ? this.disabledRoleField() : this.enableRoleField();
    } catch (e) {
      this.disabledRoleField();
    }
  }

  private enableRoleField() {
    const control = this.formGroup.get('role');
    if (control) {
      control.enable();
    }
  }

  private disabledRoleField() {
    const control = this.formGroup.get('role');
    if (control) {
      control.disable();
    }
  }

}
