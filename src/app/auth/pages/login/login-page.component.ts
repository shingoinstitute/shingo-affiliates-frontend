import { Component, OnInit } from '@angular/core'
import { Store, select } from '@ngrx/store'
import * as fromAuth from '../../reducers'
import { LoginPageActions } from '../../actions'
import { AuthPayload } from '../../services/auth.service'

@Component({
  selector: 'app-login-page',
  template: `
    <app-login-form
      (submitted)="onSubmit($event)"
      [pending]="pending$ | async"
      [errorMessage]="error$ | async"
    >
    </app-login-form>
  `,
  styles: [],
})
export class LoginPageComponent implements OnInit {
  pending$ = this.store.pipe(select(fromAuth.getLoginPagePending))
  error$ = this.store.pipe(select(fromAuth.getLoginPageError))

  constructor(private store: Store<fromAuth.State>) {}

  ngOnInit() {}

  onSubmit(payload: AuthPayload) {
    this.store.dispatch(new LoginPageActions.Login(payload))
  }
}
