/* tslint:disable */
import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialog implements OnInit {

  private password: string;
  private newPassword: string;
  private confirmPassword: string;
  private isLoading: boolean = false;

  constructor(private dialogRef: MdDialogRef<ChangePasswordDialog>, private auth: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
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
