import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';
import { User } from '../../shared/models/User';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class IsValidResolver implements CanActivate {
    constructor(private auth: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.auth.authenticationChange$.asObservable();
    }

}