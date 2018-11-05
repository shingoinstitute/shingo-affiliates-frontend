import {
  throwError as observableThrowError,
  empty as observableEmpty,
  Observable,
} from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Injectable } from '@angular/core'
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router'

import { WorkshopService } from '../services/workshop/workshop.service'
import { Workshop } from './workshop.model'
import { RouterService } from '../services/router/router.service'

@Injectable()
export class WorkshopResolver implements Resolve<Workshop> {
  constructor(public _ws: WorkshopService, public router: RouterService) {}

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<Workshop> {
    return this._ws.getById(route.params.id).pipe(
      catchError(error => {
        if (error.status === 403) {
          if (error.error === 'ACCESS_FORBIDDEN')
            this.router.navigateRoutes(['/403'])
          else this.router.navigateRoutes(['/login', state.url])
          return observableEmpty()
        }
        return observableThrowError(error)
      }),
    )
  }
}
