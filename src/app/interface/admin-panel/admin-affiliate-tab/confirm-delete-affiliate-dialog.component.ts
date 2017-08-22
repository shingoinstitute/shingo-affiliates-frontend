import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Affiliate } from "../../../affiliates/Affiliate";

@Component({
  selector: 'confirm-delete-affiliate-dialog',
  templateUrl: './confirm-delete-affiliate-dialog.component.html' 
})
export class ConfirmDeleteAffiliateDialogComponent {
  affiliate: Affiliate;
  constructor(@Inject(MD_DIALOG_DATA) public data: any) {
    this.affiliate = data as Affiliate;
  }
}