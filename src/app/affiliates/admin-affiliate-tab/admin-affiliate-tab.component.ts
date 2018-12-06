import { Component, ViewChild } from '@angular/core'
import { Affiliate } from '../../affiliates/affiliate.model'
import { AffiliateService } from '../../services/affiliate/affiliate.service'
import { SFSuccessResult } from '../../services/api/base-api.abstract.service'
import { MatSnackBar, MatDialog } from '@angular/material'

import { Router } from '@angular/router'
import { AffiliateDataTableComponent } from '../../affiliates/affiliate-data-table/affiliate-data-table.component'
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component'

@Component({
  selector: 'app-admin-affiliate-tab',
  templateUrl: './admin-affiliate-tab.component.html',
  styleUrls: ['./admin-affiliate-tab.component.scss'],
})
export class AdminAffiliateTabComponent {
  @ViewChild(AffiliateDataTableComponent)
  public dataTable!: AffiliateDataTableComponent

  public displayedColumns = ['logo', 'name', 'website', 'actions']
  public selectedAffiliate!: Affiliate
  public isLoading = true

  constructor(
    public dialog: MatDialog,
    public _as: AffiliateService,
    public snackbar: MatSnackBar,
    public router: Router,
  ) {}

  public onSave(affiliate?: Affiliate) {
    this.isLoading = true
    this.snackbar.open('Saving Changes...')

    if (affiliate) this.selectedAffiliate = affiliate

    if (this.selectedAffiliate.sfId === '') {
      this.create(this.selectedAffiliate)
    } else {
      this.update(this.selectedAffiliate)
    }
  }

  public onDelete(affiliate: Affiliate) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        sfObject: affiliate,
        message: `Are you sure you want to delete <strong>${
          affiliate.name
        }</strong>? This action cannot be undone.`,
      },
    })

    dialogRef
      .afterClosed()
      .subscribe(result => result === true && this.delete(affiliate))
  }

  public create(a: Affiliate) {
    this._as.create(a).subscribe(
      (data: SFSuccessResult) => {
        this.handleCallback(data)
        this.snackbar.open('Affiliate Successfully Created.', undefined, {
          duration: 1500,
        })
      },
      err => {
        this.handleCallback(null, err)
      },
    )
  }

  public update(a: Affiliate) {
    this._as.update(a).subscribe(
      (data: SFSuccessResult) => {
        this.handleCallback(data)
        this.snackbar.open('Affiliate Successfully Updated.', undefined, {
          duration: 1500,
        })
      },
      err => {
        this.handleCallback(null, err)
      },
    )
  }

  public delete(a: Affiliate) {
    this._as.delete(a).subscribe(
      data => {
        this.handleCallback(data)
        this.snackbar.open('Affiliate Successfully Deleted', 'Okay', {
          duration: 3000,
        })
      },
      err => {
        this.handleCallback(null, err)
      },
    )
  }

  public handleCallback(data?: any, err?: any) {
    delete this.selectedAffiliate
    this.isLoading = false

    if (data) this.dataTable.refresh()

    if (err) {
      console.error('Error in AffiliateTabComponent: ', err)
      this.snackbar.open(
        'An error occurred and your changes could not be saved.',
        'Okay',
        { panelClass: ['md-warn'] },
      )
    }
  }

  public openForm(affiliate: Affiliate) {
    this.router.navigateByUrl(`/admin/affiliate/form/${affiliate.sfId}`)
  }
}
