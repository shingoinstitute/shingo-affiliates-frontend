import { Component, Inject, OnInit, Input, Optional, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { MD_DIALOG_DATA, MdSnackBar } from "@angular/material";
import { FormGroup, FormControl } from "@angular/forms";

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

  @Input('facilitator') facilitator: Facilitator;
  @Input('isDialog') isDialog: boolean;

  @ViewChild('formContainer') formContainer: ElementRef;

  formGroup: FormGroup;
  isValid: boolean = false;
  isLoading: boolean;
  facilitatorsOpts: Facilitator[] = [];
  roles = Facilitator.DEFAULT_ROLE_OPTIONS;

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
    if (!this.facilitator) {
      this.facilitator = new Facilitator();
      this.routeSubscription = this.route.params.subscribe((route) => {
        const id = route['id'];
        if (typeof id === 'string' && id !== 'create') {
          this.getSFObject(id);
        }
      });
    }
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

  buildForm() {
    this.formGroup = new FormGroup({
      email: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      title: new FormControl(),
      photo: new FormControl(),
      role: new FormControl()
    });

    this.checkForAffiliate(); 
  }

  facilitatorSearch() {
    // listen to changes on email, lastName, and firstName formControls
    this.formGroup.get('email').valueChanges
    .debounceTime(250)
    .subscribe(query => {
      if (query && query.length > 2) {
        this._fs.search(query, false).subscribe(facilitators => {
          console.log(facilitators);
          this.facilitatorsOpts = facilitators;
        }, err => {
          console.error(err);
        });
      }
    });
  }

  onSelectChange(f: Facilitator) {
    if (f && f instanceof Facilitator) {
      this.facilitator = f;
    }
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
      this.isLoading = false;
      this.snackbar.open('A server error occurred and the facilitator could not be loaded.', 'Okay');
      console.error(err);
    });
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
    if (this.facilitator.sfId == '') {
      this.create();
    } else {
      this.update();
    }
  }

  update() {
    this._fs.update(this.facilitator).subscribe(data => {
      console.log(data);
      this.snackbar.open('Update Successful', null, { duration: 2000 });
      this.location.back();
    }, err => {
      this.handleError(err);
    });
  }

  create() {
    this._fs.create(this.facilitator).subscribe(data => {
      console.log(data);
      this.snackbar.open('Successfully Created New Facilitator.', null, { duration: 2000 });
      this.location.back();
    }, err => {
      this.handleError(err);
    });
  }

  displayFn(facilitator: Facilitator): string {
    return facilitator ? facilitator.email : '';
  }

  handleError(err: any){
    console.error(err);
    this.snackbar.open('An error occured and the requested operation could not be complete.', 'Okay');
  }

  private checkForAffiliate() {
    try {
      this.facilitator.affiliate.sfId == '' ? this.disabledRoleField() : this.enableRoleField();
    } catch(e) {
      this.disabledRoleField();
    }
  }

  private enableRoleField() {
    this.formGroup.get('role').enable();
  }

  private disabledRoleField() {
    this.formGroup.get('role').disable();
  }

}
