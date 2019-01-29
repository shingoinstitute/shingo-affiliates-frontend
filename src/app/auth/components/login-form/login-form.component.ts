import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { AuthPayload } from '../../services/auth.service'
import { typeOf } from '~app/util/predicates'
import { HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'app-login-form',
  templateUrl: `./login-form.component.html`,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        margin: 72px 0;
      }

      .mat-form-field {
        width: 100%;
        min-width: 300px;
      }

      .actions {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    `,
  ],
})
export class LoginFormComponent implements OnInit {
  private _errorMessage: unknown

  @Input()
  set pending(isPending: boolean) {
    if (isPending && !this.errorMessage) {
      this.form.disable()
    } else {
      this.form.enable()
    }
  }

  @Input()
  set errorMessage(value: unknown) {
    if (value) {
      this.form.enable()
    }
    this._errorMessage = value
  }
  get errorMessage() {
    return this._errorMessage
  }

  @Output()
  submitted = new EventEmitter<AuthPayload>()

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  get emailControl() {
    return this.form.controls.email
  }

  get passwordControl() {
    return this.form.controls.password
  }

  constructor() {}

  ngOnInit() {}

  submit() {
    if (this.form.valid) {
      this.submitted.emit(this.form.value)
    }
  }

  displayError(error: unknown): string {
    if (!error) return ''
    console.error('Displaying Error', error)

    if (typeOf('string', 'number', 'boolean', 'symbol')(error))
      return String(error)

    if (typeof error === 'object') {
      if (error instanceof HttpErrorResponse) {
        return (error.error && this.displayError(error.error)) || error.message
      }
      return JSON.stringify(error)
    }

    return 'Unknown Error'
  }
}
