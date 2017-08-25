/* tslint:disable */

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { User } from '../../shared/models/User';
import { RouterService } from '../../services/router/router.service';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw';

@Injectable()
export class UserResolver implements Resolve<User> {

    constructor(private auth: AuthService, private router: RouterService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
        return this.auth.getUser().catch(error => {
            console.log('caught http error in UserResolver', error);
            if (error.status === 403) {
                if (error.error === 'ACCESS_FORBIDDEN') this.router.navigateRoutes(['/403']);
                else this.router.navigateRoutes(['/login', state.url]);
                return Observable.empty();
            }
            return Observable.throw(error);
        });
    }
}