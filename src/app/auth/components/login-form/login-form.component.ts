import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { AuthPayload } from '../../services/auth.service'

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
  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable()
    } else {
      this.form.enable()
    }
  }

  @Input()
  errorMessage: string | undefined | null

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
}
