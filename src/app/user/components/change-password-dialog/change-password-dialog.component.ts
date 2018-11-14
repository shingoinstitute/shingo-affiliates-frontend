import { Component } from '@angular/core'
import { MatDialogRef } from '@angular/material'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { mustMatchValidator } from '../../../shared/validators/must-match.validator'
import { UserService } from '../../services/user.service'

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class ChangePasswordDialog {
  public isLoading = false
  public pwForm = new FormGroup({
    password: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', [
      Validators.required,
      mustMatchValidator(['newPassword']),
    ]),
  })

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialog>,
    public userService: UserService,
  ) {}

  public onSubmit() {
    if (this.pwForm.invalid) return
    const { password, newPassword } = this.pwForm.value as {
      password: string
      newPassword: string
      confirmPassword: string
    }
    this.isLoading = true
    this.userService
      .changePassword({
        oldPassword: password,
        password: newPassword,
      })
      .subscribe(
        () => {
          this.isLoading = false
          this.dialogRef.close('Password Changed!')
        },
        err => {
          this.isLoading = false
          if (err.error.message === 'INVALID_PASSWORD') {
            this.pwForm.controls['password'].setErrors({
              invalidPassword: true,
            })
          } else {
            console.error('Error while changing password', err)
            throw err
          }
        },
      )
  }
}
