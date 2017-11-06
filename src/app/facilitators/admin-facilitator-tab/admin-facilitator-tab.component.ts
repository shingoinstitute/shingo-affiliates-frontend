import { Component } from '@angular/core';
import { Facilitator } from '../../facilitators/facilitator.model';
import { FacilitatorService } from '../../services/facilitator/facilitator.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { FacilitatorFormComponent } from '../facilitator-form/facilitator-form.component';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-admin-facilitator-tab',
  templateUrl: './admin-facilitator-tab.component.html',
  styleUrls: ['./admin-facilitator-tab.component.scss']
})
export class AdminFacilitatorTabComponent {

  public isLoading: boolean = true;
  public displayedColumns: string[] = ['name'];
  public newFacilitator: Facilitator;

  constructor(public _fs: FacilitatorService, public snackbar: MatSnackBar, public dialog: MatDialog, public router: Router) { }

  public onSave(facilitator: Facilitator) {
    this.isLoading = true;
    this.snackbar.open('Saving Changes...');
    if (facilitator.sfId === '') {
      this.create(facilitator);
    } else {
      this.update(facilitator);
    }
  }

  public onDelete(f: Facilitator) {
    const msg = `
      Are you sure you want to delete <strong>${f.name}'s</strong> account? This action cannot be undone.
      <br>
      <span class="mat-caption">This action will delete the user's contact information from Salesforce and remove them from the database.</span>
    `;
    const title = `Delete ${f.constructor.name}?`;
    this.presentAlertDialog(f, msg, title);
  }

  public onDisable(f: Facilitator) {
    const msg = `
    Are you sure you want to disable <strong>${f.name}'s</strong> account?
    <br>
    <span class="mat-caption">This action will remove the user's ability to login without deleting their account information.</span>
    `;
    const title = `Disable ${f.constructor.name}?`;
    this.presentAlertDialog(f, msg, title);
  }

  public presentAlertDialog(f: Facilitator, msg: string, title: string = '', shouldDelete: boolean = false) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: title,
        sfObject: f,
        message: msg
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true && shouldDelete) {
        this.delete(f);
      } else if (result === true) {
        this.disable(f);
      }
    });
  }

  public onResetPassword(f: Facilitator) {
    const dialogReg = this.dialog.open(AlertDialogComponent, {
      data: {
        title: `Reset Password?`,
        sfObject: f,
        message: `Send password-reset email to ${f.name}?`
      }
    });

    dialogReg.afterClosed().subscribe(result => {
      if (result === true) {
        this.resetPassword(f);
      }
    });
  }

  public resetPassword(fac: Facilitator) {
    this.isLoading = true;
    this.snackbar.open(`Sending password reset email to ${fac.email}...`);
    this._fs.resetPassword(fac.email).subscribe(data => {
      this.apiCallbackHandler(data);
      this.snackbar.open('Password reset email has been sent.', null, { duration: 2000 });
    }, err => {
      this.apiCallbackHandler(null, err);
    });
  }

  public update(fac: Facilitator) {
    this._fs.update(fac).subscribe(data => {
      this.apiCallbackHandler(data);
      this.snackbar.open('Facilitator Successfully Updated', null, { duration: 2000 });
    }, err => {
      this.apiCallbackHandler(null, err);
    });
  }

  public create(facilitator: Facilitator) {
    this._fs.create(facilitator).subscribe(data => {
      this.apiCallbackHandler(data);
      this.snackbar.open('Facilitator Succesfully Created', null, { duration: 2000 });
    }, err => {
      this.apiCallbackHandler(null, err);
    });
  }

  public delete(fac: Facilitator) {
    this.isLoading = true;
    this.snackbar.open(`Deleting ${fac.name}'s Account...`);
    this._fs.delete(fac).subscribe(data => {
      this.apiCallbackHandler(data);
      this.snackbar.open('Facilitator Successfully Deleted.', null, { duration: 2000 });
    }, err => {
      this.apiCallbackHandler(null, err);
    });
  }

  public disable(fac: Facilitator) {
    this.isLoading = true;
    this.snackbar.open(`Disabling ${fac.name}'s Account...`);
    this._fs.disable(fac).subscribe(data => {
      this.apiCallbackHandler(data);
      this.snackbar.open('Facilitator Successfully Disabled', 'Okay', { duration: 2000 });
    }, err => {
      this.apiCallbackHandler(null, err);
    });
  }

  public onCreate() {
    const dialogRef = this.dialog.open(FacilitatorFormComponent, {
      data: {
        isDialog: true,
        facilitator: new Facilitator()
      }
    });

    dialogRef.afterClosed().subscribe(facilitator => {
      if (facilitator) {
        this.onSave(facilitator);
      }
    });
  }

  public apiCallbackHandler(data?: any, err?: any) {
    this.isLoading = false;
    this._fs.reloadData$.emit();
    if (err) {
      this.snackbar.open('An error occured and the requested operation could not be completed.', 'Okay', { duration: 3000 });
      console.error(err);
    }
  }

}
