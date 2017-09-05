import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { SimpleMessageDialog } from '../../../shared/components/simple-message-dialog/simple-message-dialog.component';
import { FacilitatorService } from '../../../services/facilitator/facilitator.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  private password: string;
  private passwordConfirm: string;
  private errMsg: string;
  private errBody: string;
  private isLoading: boolean = false;

  constructor(private _fs: FacilitatorService,
    private dialog: MdDialog,
    private route: ActivatedRoute,
    private router: Router) { }

  public ngOnInit() {
    this.password = '';
    this.passwordConfirm = '';
  }

  private onSubmit() {
    if (this.password !== this.passwordConfirm) {
      this.errMsg = 'Passwords don\'t match';
      return;
    }
    this.errBody = '';
    this.errMsg = '';
    this.isLoading = true;
    this._fs.changePassword(this.route.snapshot.queryParams['token'], this.password)
      .subscribe((data) => {
        this.isLoading = false;
        const dialogRef = this.dialog.open(SimpleMessageDialog, {
          data: `Your password has been reset. Press 'OK' to go to the login page.`
        });
        dialogRef.afterClosed().subscribe(() => this.router.navigateByUrl('/login'));
      }, err => {
        console.error('error', err);
        const msg = err.error && err.error.error ? err.error.error : '';
        if (msg === 'EMAIL_NOT_FOUND' || msg === 'USER_NOT_FOUND') {
          this.errMsg = 'Email not found.';
        } else if (err.status === 0) {
          this.errMsg = 'Connection Refused.';
          this.errBody = 'We may be experiencing server difficulties, please try again later.';
        } else {
          this.errMsg = `An unknown error occured. Please try again later.`;
          this.errBody = JSON.stringify(err, null, 3);
        }
      });
  }

}
