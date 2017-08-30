// Angular Modules
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

// App Modules
import { AuthService } from '../../../services/auth/auth.service';
import { RouterService } from '../../../services/router/router.service';
import { FillViewHeightDirective } from '../../../shared/directives/fill-height.directive';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [FillViewHeightDirective]
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('loginRoot') private root: ElementRef;

  private email: string;
  private password: string;

  private isLoading: boolean = true;
  private didLoad: boolean = false;

  private errBody: string;
  private errMsg: string;

  constructor(private auth: AuthService,
    private router: Router,
    private fillHeight: FillViewHeightDirective,
    private routerService: RouterService) { }

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
    // this.auth.userIsValid();
  }

  public ngAfterViewInit() {
    $(this.root.nativeElement).css('position', 'relative');
    this.fillHeight.fillHeightOnElement(this.root);
  }

  /**
   * @description Handler for submitting login credentials.
   */
  private onSubmit() {
    this.auth.login({ email: this.email, password: this.password })
      .subscribe((data) => {
        this.routerService.nextRoute();
      }, err => {
        console.error(err);
        const msg = err.error && err.error.error ? err.error.error : '';
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

}
