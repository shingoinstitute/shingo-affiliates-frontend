// Angular Modules
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// App Modules
import { AuthService } from '../../../services/auth/auth.service';
import { RouterService } from '../../../services/router/router.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public email: string;
  public password: string;

  public isLoading: boolean = true;
  public didLoad: boolean = false;

  public errBody: string;
  public errMsg: string;

  constructor(
    public auth: AuthService,
    public router: Router,
    public routerService: RouterService
  ) { }

  /**
   * @description Dimisses loading indicator after seeing if a user is authenticated.
   * If the user is authenticated, this component is dismissed by 
   * the root app component.
   */
  public ngOnInit(): void {
    this.auth.authenticationChange$.subscribe((auth: boolean) => {
      this.isLoading = false;
      this.didLoad = true;
    }, err => {
      console.error('error: Login.onLoad():', err);
      this.isLoading = false;
      this.didLoad = true;
    });
  }

  /**
   * @description Handler for submitting login credentials.
   */
  public onSubmit() {
    this.isLoading = true;
    this.auth.login({ email: this.email, password: this.password })
      .subscribe((data) => {
        this.isLoading = false;
        this.routerService.nextRoute();
      }, err => {
        console.error(err);
        this.isLoading = false;
        const msg = this.findErrorMsg(err);
        if (msg === 'INVALID_PASSWORD')
          this.errMsg = 'Invalid password.';
        else if (msg === 'EMAIL_NOT_FOUND')
          this.errMsg = 'Email not found.';
        else if (err.status === 0) {
          this.errMsg = 'Connection Refused.';
          this.errBody = 'We may be experiencing server difficulties, please try again later.';
        } else {
          this.errMsg = `An unknown error occured. Please try again later.`;
          this.errBody = JSON.stringify(err, null, 3);
        }
      });
  }

  public findErrorMsg(obj: object, key: string = 'error'): string {
    if (obj && typeof obj[key] === 'object') {
      return this.findErrorMsg(obj[key]);
    } else if (typeof obj[key] === 'string') {
      return obj[key];
    } else {
      return '';
    }
  }
}
