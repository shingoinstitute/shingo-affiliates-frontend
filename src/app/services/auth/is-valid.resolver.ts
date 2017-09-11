import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';
import { User } from '../../shared/models/user.model';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class IsValidResolver implements CanActivate {
  constructor(public auth: AuthService) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.auth.authenticationChange$.asObservable();
  }

}