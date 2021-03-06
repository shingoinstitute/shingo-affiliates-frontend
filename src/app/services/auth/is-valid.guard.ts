import { map } from 'rxjs/operators'
import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router'

import { AuthService } from './auth.service'

import { Observable } from 'rxjs'

@Injectable()
export class IsValidGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.auth.isValid().pipe(
      map(value => {
        if (!value) this.router.navigate(['login'])
        return value
      }),
    )
  }
}
