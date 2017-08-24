import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { WorkshopService } from '../services/workshop/workshop.service';
import { Workshop } from './Workshop';

import { Observable } from 'rxjs/Rx';
@Injectable()
export class WorkshopResolver implements Resolve<Workshop> {
    constructor(private _ws: WorkshopService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Workshop> {
        return this._ws.getById(route.params.id)
            .catch(error => {
                console.error(`error in resolving workshop ${route.params.id}`, error);
                return Observable.throw(error);
            });
    }
}
