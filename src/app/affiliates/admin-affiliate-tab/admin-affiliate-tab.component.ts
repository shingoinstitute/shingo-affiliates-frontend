import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { Affiliate } from '../../affiliates/affiliate.model';
import { AffiliateService } from '../../services/affiliate/affiliate.service';
import { ISFSuccessResult } from '../../services/api/base-api.abstract.service';
import { MdSnackBar, MdDialog } from '@angular/material';

import { AffiliateFormComponent } from '../../affiliates/affiliate-form/affiliate-form.component';
import { Router, NavigationExtras } from '@angular/router';
import { AffiliateDataTableComponent } from '../../affiliates/affiliate-data-table/affiliate-data-table.component';
import { AlertDialogComponent } from '../../ui-components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-admin-affiliate-tab',
  templateUrl: './admin-affiliate-tab.component.html',
  styleUrls: ['./admin-affiliate-tab.component.scss']
})
export class AdminAffiliateTabComponent {

  @ViewChild(AffiliateDataTableComponent) private dataTable: AffiliateDataTableComponent;

  private displayedColumns = ['logo', 'name', 'website', 'actions'];
  private selectedAffiliate: Affiliate;
  private isLoading: boolean = true;

  constructor(public dialog: MdDialog, private _as: AffiliateService, private snackbar: MdSnackBar, private router: Router) { }

  private onSave(affiliate?: Affiliate) {
    this.isLoading = true;
    this.snackbar.open('Saving Changes...');

    if (affiliate) this.selectedAffiliate = affiliate;

    if (this.selectedAffiliate.sfId === '')
      this.create(this.selectedAffiliate);
    else
      this.update(this.selectedAffiliate);
  }

  private onCreate() {
    const dialogRef = this.dialog.open(AffiliateFormComponent, {
      data: {
        isDialog: true,
        affiliate: new Affiliate()
      }
    });

    dialogRef.afterClosed().subscribe(affiliate => affiliate && this.create(affiliate));
  }

  private onDelete(affiliate: Affiliate) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        sfObject: affiliate,
        message: `Are you sure you want to delete <strong>${affiliate.name}</strong>? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => result === true && this.delete(affiliate));
  }

  private create(a: Affiliate) {
    this._as.create(a).subscribe((data: ISFSuccessResult) => {
      this.handleCallback(data);
      this.snackbar.open('Affiliate Successfully Created.', null, { duration: 1500 });
    }, err => { this.handleCallback(null, err); });
  }

  private update(a: Affiliate) {
    this._as.update(a).subscribe((data: ISFSuccessResult) => {
      this.handleCallback(data);
      this.snackbar.open('Affiliate Successfully Updated.', null, { duration: 1500 });
    }, err => { this.handleCallback(null, err); });
  }

  private delete(a: Affiliate) {
    this._as.delete(a).subscribe(data => {
      this.handleCallback(data);
      this.snackbar.open('Affiliate Successfully Deleted', 'Okay', { duration: 3000 });
    }, err => { this.handleCallback(null, err); });
  }

  private handleCallback(data?: any, err?: any) {
    delete this.selectedAffiliate;
    this.isLoading = false;

    if (data) this.dataTable.refresh();

    if (err) {
      console.error('Error in AffiliateTabComponent: ', err);
      this.snackbar.open('An error occurred and your changes could not be saved.', 'Okay', { extraClasses: ['md-warn'] });
    }
  }

  private openForm(affiliate: Affiliate) {
    this.router.navigateByUrl(`/admin/affiliate/form/${affiliate.sfId}`);
  }

}
