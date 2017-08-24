import { Component, Inject, OnInit, Input, Optional, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { MD_DIALOG_DATA, MdSnackBar } from "@angular/material";

import { Facilitator } from "../Facilitator";
import { FacilitatorService } from "../../services/facilitator/facilitator.service";
import { Affiliate } from "../../affiliates/Affiliate";

@Component({
  selector: 'app-facilitator-form',
  templateUrl: './facilitator-form.component.html',
  styleUrls: ['./facilitator-form.component.scss']
})
export class FacilitatorFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('facilitator') facilitator: Facilitator;
  @Input('isDialog') isDialog: boolean;

  @ViewChild('formContainer') formContainer: ElementRef;

  isValid: boolean = true;
  isLoading: boolean;

  private routeSubscription;

  constructor(
    @Optional() @Inject(MD_DIALOG_DATA) public data: any, 
    private snackbar: MdSnackBar, 
    private _fs: FacilitatorService,
    private location: Location, 
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    if (this.data) {
      this.isDialog = this.data.isDialog;
      this.facilitator = this.data.facilitator;
    }

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
    // center element if it's not a dialog box
    if (!this.isDialog) {
      $(this.formContainer.nativeElement).css('margin', '0 auto');
    }
  }

  ngOnDestroy() {
    this.routeSubscription && this.routeSubscription.unsubscribe();
  }

  getSFObject(id: string) {
    this.isLoading = true;
    this._fs.getById(id).subscribe((facilitator: Facilitator) => {
      if (facilitator) { this.facilitator = facilitator; }
      this.isLoading = false;
    }, err => {
      console.error(err);
      this.isLoading = false;
    });
  }

  onSelectAffiliate(affiliate: Affiliate) {
    if (affiliate) {
      this.facilitator.affiliate = affiliate;
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
    console.log(this.facilitator);
    this._fs.create(this.facilitator).subscribe(data => {
      console.log(data);
      this.snackbar.open('Successfully Created New Facilitator.', null, { duration: 2000 });
      this.location.back();
    }, err => {
      this.handleError(err);
    });
  }

  handleError(err: any){
    console.error(err);
    this.snackbar.open('An error occured and the requested operation could not be complete.', 'Okay');
  }

}
