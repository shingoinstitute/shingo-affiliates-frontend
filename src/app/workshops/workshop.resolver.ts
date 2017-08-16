import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { WorkshopService } from './workshop.service';
import { Workshop } from './Workshop';

@Injectable()
export class WorkshopResolver implements Resolve<Workshop> {
    constructor(private _ws: WorkshopService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Workshop> {
        return this._ws.getById(route.params.id);
    }
}