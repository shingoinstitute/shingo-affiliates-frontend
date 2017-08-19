import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';
import { User } from '../../shared/models/User';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class UserResolver implements Resolve<User> {

    constructor(private auth: AuthService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
        return this.auth.getUser();
    }
}