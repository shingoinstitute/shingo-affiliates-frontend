import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { User } from '../../shared/models/user.model';
import { RouterService } from '../../services/router/router.service';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw';

@Injectable()
export class UserResolver implements Resolve<User> {

  constructor(public auth: AuthService, public router: RouterService) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return this.auth.getUser().catch(error => {
      if (error.status === 403) {
        if (error.error === 'ACCESS_FORBIDDEN') this.router.navigateRoutes(['/403']);
        else this.router.navigateRoutes(['/login', state.url]);
        return Observable.empty();
      }
      return Observable.throw(error);
    });
  }
}