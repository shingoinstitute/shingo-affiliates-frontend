import { Component } from '@angular/core'
import { MatDialogRef } from '@angular/material'

import { AuthService } from '../../../services/auth/auth.service'
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms'
import { tuple } from '../../../util/functional'

export const mustMatchValidator = (
  names: string[],
  comparator: (a: unknown, b: unknown) => boolean = (a, b) => a === b,
): ValidatorFn => control => {
  if (!control.parent) return null

  if (names.length === 0)
    throw new Error(
      'mustMatchValidator(): must provide at least one control name',
    )

  const values = names.map(n => {
    const g = control.parent.get(n)
    if (!g)
      throw new Error(
        `mustMatchValidator(): control ${n} does not exist in parent group`,
      )
    g.valueChanges.subscribe(() => control.updateValueAndValidity())
    return tuple(n, g.value)
  })

  const value = control.value
  let reason = null
  const allEqual = values.every(([n, a]) => {
    if (!comparator(a, value)) {
      reason = `Control ${n} with value ${a} does not match ${value}`
      return false
    }
    return true
  })

  return allEqual ? null : { must_match: reason }
}

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
    public auth: AuthService,
  ) {}

  public onSubmit() {
    if (!this.pwForm.valid) return
    const { password, newPassword } = this.pwForm.value as {
      password: string
      newPassword: string
      confirmPassword: string
    }
    if (!this.auth.user) return
    this.isLoading = true
    this.auth.login({ email: this.auth.user.email, password }).subscribe(
      () => {
        this.auth.changeUserPassword(newPassword).subscribe(() => {
          this.isLoading = false
          this.dialogRef.close('Password Changed!')
        })
      },
      err => {
        this.isLoading = false
        console.error('GOT ERROR', err)
        if (err.error.error.error === 'INVALID_PASSWORD') {
          this.pwForm.controls['password'].setErrors({ invalidPassword: true })
        } else {
          throw err
        }
      },
    )
  }
}
