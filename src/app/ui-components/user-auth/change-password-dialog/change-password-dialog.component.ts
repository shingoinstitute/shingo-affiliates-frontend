import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ChangePasswordDialog {

  public password: string;
  public newPassword: string;
  public confirmPassword: string;
  public isLoading: boolean = false;

  constructor(public dialogRef: MdDialogRef<ChangePasswordDialog>, public auth: AuthService) { }

  public onSubmit() {
    if (this.newPassword !== this.confirmPassword) return;
    this.isLoading = true;
    this.auth.login({ email: this.auth.user.email, password: this.password })
      .subscribe(data => {
        this.auth.changeUserPassword(this.newPassword)
          .subscribe(() => {
            this.isLoading = false;
            this.dialogRef.close('Password Changed!');
          });
      });
  }
}
