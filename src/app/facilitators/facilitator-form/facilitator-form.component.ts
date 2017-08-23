import { Component, Inject, OnInit, Input, ViewChild } from '@angular/core';
import { Facilitator } from "../Facilitator";
import { MD_DIALOG_DATA, MdSnackBar } from "@angular/material";
import { FacilitatorService } from "../../services/facilitator/facilitator.service";
import { Affiliate } from "../../affiliates/Affiliate";

@Component({
  selector: 'app-facilitator-form',
  templateUrl: './facilitator-form.component.html',
  styleUrls: ['./facilitator-form.component.scss']
})
export class FacilitatorFormComponent implements OnInit {

  @Input('facilitator') facilitator: Facilitator;
  @Input('isDialog') isDialog: boolean;

  isValid: boolean = true;

  constructor(@Inject(MD_DIALOG_DATA) public data: any, private snackbar: MdSnackBar, private _fs: FacilitatorService) {
    
  }

  ngOnInit() {
    if (this.data) {
      this.isDialog = this.data.isDialog;
      this.facilitator = this.data.facilitator;
    }

    if (!this.facilitator) {
      this.facilitator = new Facilitator();
    }
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
    }, err => {
      this.handleError(err);
    });
  }

  create() {
    console.log(this.facilitator);
    this._fs.create(this.facilitator).subscribe(data => {
      console.log(data);
      this.snackbar.open('Successfully Created New Facilitator.', null, { duration: 2000 });
    }, err => {
      this.handleError(err);
    });
  }

  handleError(err: any){
    console.error(err);
    this.snackbar.open('An error occured and the requested operation could not be complete.', 'Okay');
  }

}
