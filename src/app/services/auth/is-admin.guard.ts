import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
} from '@angular/router'

import { AuthService } from './auth.service'

import { Observable } from 'rxjs'

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth._user && this.auth._user.isAdmin) return true

    this.router.navigate(['403'])
    return false
  }
}
