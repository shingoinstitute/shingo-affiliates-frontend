import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { Router } from '@angular/router'

import { SimpleMessageDialog } from '../../../shared/components/simple-message-dialog/simple-message-dialog.component'
import { FacilitatorService } from '../../../services/facilitator/facilitator.service'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  public email: string
  public errMsg: string
  public errBody: string
  public isLoading = false

  constructor(
    public _fs: FacilitatorService,
    public dialog: MatDialog,
    public router: Router,
  ) {}

  public ngOnInit() {
    this.email = ''
  }

  public onSubmit() {
    this.errBody = ''
    this.errMsg = ''

    if (!this.email.length || !this.email.includes('@')) {
      this.errMsg = 'Please enter a valid email address before subitting.'
      return
    }

    this.isLoading = true
    this._fs.resetPassword(this.email).subscribe(
      data => {
        this.isLoading = false
        const dialogRef = this.dialog.open(SimpleMessageDialog, {
          data: `An email has been sent to ${
            this.email
          } with a link to reset your password!`,
        })
        dialogRef
          .afterClosed()
          .subscribe(() => this.router.navigateByUrl('/login'))
      },
      err => {
        console.error('error', err)
        const msg = err.error ? err.error : ''
        if (msg === 'EMAIL_NOT_FOUND' || msg === 'USER_NOT_FOUND') {
          this.errMsg = 'An account using that email was not found.'
        } else if (err.status === 0) {
          this.errMsg = 'Connection Refused.'
          this.errBody =
            'We may be experiencing server difficulties, please try again later.'
        } else {
          this.errBody = JSON.stringify(err.error, null, 3)
        }
      },
    )
  }
}
