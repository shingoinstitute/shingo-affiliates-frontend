import { Component, Output, EventEmitter } from '@angular/core';
import { Affiliate } from "../../../affiliates/Affiliate";
import { AffiliateService } from "../../../services/affiliate/affiliate.service";
import { SFSuccessResult } from "../../../services/base-api.abstract.service";
import { MdSnackBar, MdDialog } from "@angular/material";
import { ConfirmDeleteAffiliateDialogComponent } from "./confirm-delete-affiliate-dialog.component";

@Component({
  selector: 'app-admin-affiliate-tab',
  templateUrl: './admin-affiliate-tab.component.html',
  styleUrls: ['./admin-affiliate-tab.component.scss', '../admin-panel.component.scss']
})
export class AdminAffiliateTabComponent {

  displayedColumns = ["logo", "name", "website", "actions"];

  selectedAffiliate: Affiliate;

  isLoading: boolean = true;

  constructor(public dialog: MdDialog, private _as: AffiliateService, private snackbar: MdSnackBar) { }

  onClickSave() {
    this.isLoading = true;
    if (this.selectedAffiliate.sfId == '')
      this.createAffiliate(this.selectedAffiliate);
    else
      this.updateAffiliate(this.selectedAffiliate);
  }

  onClickCancel() {
    this.selectedAffiliate = null;
  }

  onClickCreate() {
    this.selectedAffiliate = new Affiliate();
  }

  onClickEditHandler(affiliate: Affiliate) {
    this.selectedAffiliate = affiliate;
  }

  onClickDeleteHandler(affiliate: Affiliate) {
    let dialogRef = this.dialog.open(ConfirmDeleteAffiliateDialogComponent, {
      data: affiliate
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Result: ${result}`);
      if (result === true)
        this.deleteAffiliate(affiliate);
    });
  }

  createAffiliate(a: Affiliate) {
    this._as.create(a).subscribe((data: SFSuccessResult) => {
      this.onHandleCallback(data);
      this.snackbar.open('Affiliate Successfully Created.', null, { duration: 1500 });
    }, err => { this.onHandleCallback(null, err); })
  }

  updateAffiliate(a: Affiliate) {
    this._as.update(a).subscribe((data: SFSuccessResult) => {
      this.onHandleCallback(data);
      this.snackbar.open('Affiliate Successfully Updated.', null, { duration: 1500 });
    }, err => { this.onHandleCallback(null, err); });
  }

  deleteAffiliate(a: Affiliate) {
    this._as.delete(a).subscribe(data => {
      this.onHandleCallback(data);
      this.snackbar.open('Affiliate Successfully Deleted', 'Okay', { duration: 3000 });
    }, err => { this.onHandleCallback(null, err); });
  }

  onHandleCallback(data?: any, err?: any) {
    delete this.selectedAffiliate;
    this.isLoading = false;
    if (data) { console.log(data); }
    if (err) {
      console.error(err);
      this.snackbar.open('An error occurred and your changes could not be saved.', 'Okay');
    }
    this._as.reloadData$.next();
  }

}