// Angular Modules
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

// App Modules
import { AuthService } from '../../../services/auth/auth.service'
import { RouterService } from '../../../services/router/router.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public email = ''
  public password = ''

  public isLoading = true
  public didLoad = false

  public errBody = ''
  public errMsg = ''
  private returnUrl = '/'

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public routerService: RouterService,
  ) {}

  /**
   * @description Dimisses loading indicator after seeing if a user is authenticated.
   * If the user is authenticated, this component is dismissed by
   * the root app component.
   */
  public ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'
  }

  /**
   * @description Handler for submitting login credentials.
   */
  public onSubmit() {
    if (!this.email || !this.password) {
      this.handleError({ error: 'INVALID_PASSWORD' })
      return
    }

    this.isLoading = true
    this.auth
      .login({ email: this.email, password: this.password })
      .then(() => {
        this.isLoading = false
        // this.routerService.nextRoute()
        this.router.navigateByUrl(this.returnUrl)
      })
      .catch(err => this.handleError(err))
  }

  private handleError(err: any) {
    this.isLoading = false
    console.error(err)
    const msg = err.error ? err.error : ''
    if (msg === 'INVALID_PASSWORD') this.errMsg = 'Invalid Email or Password'
    else if (msg === 'EMAIL_NOT_FOUND')
      this.errMsg = 'Invalid Email or Password'
    else if (err.status === 0) {
      this.errMsg = 'Connection Refused.'
      this.errBody =
        'We may be experiencing server difficulties, please try again later.'
    } else {
      this.errBody = JSON.stringify(err.error, null, 3)
    }
  }
}
