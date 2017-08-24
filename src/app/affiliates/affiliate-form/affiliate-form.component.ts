import { Component, OnInit, Input, Inject } from '@angular/core';
import { Affiliate } from "../Affiliate";
import { MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { AffiliateService } from "../../services/affiliate/affiliate.service";

@Component({
  selector: 'app-affiliate-form',
  templateUrl: './affiliate-form.component.html',
  styleUrls: ['./affiliate-form.component.scss']
})
export class AffiliateFormComponent implements OnInit {

  @Input('affiliate') affiliate: Affiliate;

  private isDialog: boolean;

  constructor(@Inject(MD_DIALOG_DATA) public data: any, private _as: AffiliateService, private snackbar: MdSnackBar) { }

  ngOnInit() {
    if (this.data) {
      this.isDialog = this.data.isDialog;
      this.affiliate = this.data.affiliate;
    }

    if (!this.affiliate) {
      this.affiliate = new Affiliate();
    }
  }

  onClickSave() {
    this.snackbar.open('Saving Changes...');
    if (this.affiliate.sfId == '') {
      this.create();
    } else {
      this.update();
    }
  }

  create() {
    this._as.create(this.affiliate).subscribe(data => {
      console.log(data);
      this.snackbar.open('Successfully Created New Affiliate', null, { duration: 2000 });
    }, err => {
      this.handleError(err);
    });
  }

  update() {
    this._as.update(this.affiliate).subscribe(data => {
      console.log(data);
      this.snackbar.open('Update Successful', null, { duration: 2000 });
    }, err => {
      this.handleError(err);
    });
  }

  handleError(err: any) {
    console.error(err);
    this.snackbar.open('An error occurred and the requested operation could not be completed.', 'Okay');
  }

}
