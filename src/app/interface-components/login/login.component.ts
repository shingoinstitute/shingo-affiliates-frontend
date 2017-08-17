import { Component, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from "../../shared/providers/auth.service";
import { Router } from "@angular/router";
import { FillViewHeightDirective } from '../../shared/directives/fill-height.directive';
import { RouterService } from '../../shared/providers/router.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [FillViewHeightDirective]
})
export class LoginComponent {

    email: string;
    password: string;

    isLoading: boolean = true;
    didLoad: boolean = false;

    errBody: string;
    errMsg: string;

    @ViewChild('loginRoot') root: ElementRef;

    constructor(private auth: AuthService,
        private router: Router,
        private fillHeight: FillViewHeightDirective,
        private routerService: RouterService) { this.onLoad(); }

    /**
     * @description Dimisses loading indicator after seeing if a user is authenticated.
     * If the user is authenticated, this component is dismissed by 
     * the root app component.
     */
    onLoad(): void {
        this.auth.authenticationChange$.subscribe((auth: boolean) => {
            if (auth)
                this.routerService.nextRoute();
            this.isLoading = false;
            this.didLoad = true;
        });
        // this.auth.userIsValid();
    }

    ngAfterViewInit() {
        if (this.router.url == "/login") {
            $(this.root.nativeElement).css('position', 'relative');
            this.fillHeight.setHeight(this.root);
        }
    }

    /**
     * @description Handler for submitting login credentials.
     */
    onSubmit() {
        this.auth.login({ email: this.email, password: this.password })
            .subscribe((data) => {
                console.log('AFTER LOGIN:', data);
            }, err => {
                console.error(err);
                const msg = err.error && err.error.error ? err.error.error : "";
                if (msg === "INVALID_PASSWORD")
                    this.errMsg = "Invalid password."
                else if (msg === "EMAIL_NOT_FOUND")
                    this.errMsg = "Email not found."
                else if (err.status === 0) {
                    this.errMsg = "Connection Refused.";
                    this.errBody = "We may be experiencing server difficulties, please try again later.";
                } else {
                    this.errMsg = `An unknown error occured. Please try again later.`;
                    this.errBody = JSON.stringify(err, null, 3);
                }
            });
    }

}
