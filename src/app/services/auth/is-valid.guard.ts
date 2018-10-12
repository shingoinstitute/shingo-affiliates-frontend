import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router'

import { AuthService } from './auth.service'

@Injectable()
export class IsValidGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  public canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const valid = this.auth.isValid()
    if (!valid)
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url } })
    return valid
  }
}
