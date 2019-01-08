import { throwError as observableThrowError, EMPTY, Observable } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Injectable } from '@angular/core'
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router'

import { WorkshopService } from '~app/workshops/services/workshop.service'
import { WorkshopBase } from './workshop.model'
import { RouterService } from '../services/router/router.service'

@Injectable()
export class WorkshopResolver implements Resolve<WorkshopBase> {
  constructor(public _ws: WorkshopService, public router: RouterService) {}

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<WorkshopBase> {
    return this._ws.getById(route.params.id).pipe(
      catchError(error => {
        if (error.status === 403) {
          if (error.error === 'ACCESS_FORBIDDEN')
            this.router.navigateRoutes(['/403'])
          else this.router.navigateRoutes(['/login', state.url])
          return EMPTY
        }
        return observableThrowError(error)
      }),
    )
  }
}
