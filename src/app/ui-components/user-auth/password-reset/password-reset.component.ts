import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'

import { SimpleMessageDialog } from '../../../shared/components/simple-message-dialog/simple-message-dialog.component'
import { FacilitatorService } from '../../../services/facilitator/facilitator.service'

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent implements OnInit {
  public password: string
  public passwordConfirm: string
  // public errMsg: string;
  public errMsg: string
  public errBody: string
  public isLoading = false

  constructor(
    public _fs: FacilitatorService,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
  ) {}

  public ngOnInit() {
    this.password = ''
    this.passwordConfirm = ''
  }

  public onSubmit() {
    if (this.password !== this.passwordConfirm) {
      this.errMsg = "Passwords don't match"
      return
    }

    this.errBody = ''
    this.errMsg = ''
    this.isLoading = true

    this._fs
      .changePassword(this.route.snapshot.queryParams['token'], this.password)
      .subscribe(
        data => {
          this.isLoading = false
          const dialogRef = this.dialog.open(SimpleMessageDialog, {
            data: `Your password has been reset. Press 'OK' to go to the login page.`,
          })
          dialogRef
            .afterClosed()
            .subscribe(() => this.router.navigateByUrl('/login'))
        },
        err => {
          console.error('error', err)
          const msg = err.error && err.error.error ? err.error.error : ''
          if (msg === 'EMAIL_NOT_FOUND' || msg === 'USER_NOT_FOUND') {
            this.errMsg = 'Email not found.'
          } else if (msg === 'RESET_TOKEN_EXPIRED') {
            this.errMsg =
              'Password-reset token expired. Password reset links expire 15 minutes after being sent to your email account. Please <a href="/forgotpassword">request a new link</a>.'
          } else if (err.status === 0) {
            this.errMsg = 'Connection Refused.'
            this.errBody =
              'We may be experiencing server difficulties, please try again later.'
          } else if (msg === 'USER_NOT_FOUND') {
            this.errMsg =
              'User not found. Please make sure you are using the correct email address associated with the affiliate portal.'
          } else {
            this.errMsg = `An unknown error occured. Please try again later.`
            this.errBody = JSON.stringify(err, null, 3)
          }
        },
      )
  }
}
