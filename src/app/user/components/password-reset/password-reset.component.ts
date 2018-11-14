import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'

import { SimpleMessageDialog } from '../../../shared/components/simple-message-dialog/simple-message-dialog.component'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { mustMatchValidator } from '../../../shared/validators/must-match.validator'
import { UserService } from '../../services/user.service'

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  public pwForm = new FormGroup({
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', [
      Validators.required,
      mustMatchValidator(['password']),
    ]),
  })

  // public errMsg: string;
  public errMsg = ''
  public errBody = ''
  public isLoading = false

  constructor(
    public userService: UserService,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
  ) {}

  public onSubmit() {
    if (this.pwForm.invalid) return
    const { password, confirmPassword } = this.pwForm.value as {
      password: string
      confirmPassword: string
    }

    if (password !== confirmPassword) {
      this.errMsg = "Passwords don't match"
      return
    }

    this.errBody = ''
    this.errMsg = ''
    this.isLoading = true

    this.userService
      .resetPassword({
        token: this.route.snapshot.queryParams['token'],
        password,
      })
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
