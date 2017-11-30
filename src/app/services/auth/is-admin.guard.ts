import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';
import { RouterService } from '../router/router.service';

import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router/src/router';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: RouterService) {}
 
  public canActivate(route: ActivatedRouteSnapshot,  state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    if (this.auth._user && this.auth._user.isAdmin) {
      return true;
    } else if (!this.auth._user) {
      return this.auth.getUser().map(user => user.isAdmin); 
    } else {
      this.router.navigateRoutes(['403']);
    }

    return false;
  }
}