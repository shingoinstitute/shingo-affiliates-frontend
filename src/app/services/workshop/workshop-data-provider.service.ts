// Angular Modules
import { Injectable } from '@angular/core';

// App Modules
import { Workshop } from '../../workshops/Workshop';
import { Filter } from '../filters/filter.abstract';
import { WorkshopService } from './workshop.service'

// RxJS Modules
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Lodash functions
import { intersectionBy, isEqual, flatten } from 'lodash';

@Injectable()
export class WorkshopDataProvider {

  private dataChangeSource: BehaviorSubject<Workshop[]> = new BehaviorSubject<Workshop[]>([]);
  private _filters: Filter[] = [];

  public get dataChange(): Observable<Workshop[]> { return this.dataChangeSource.asObservable(); }
  public get filters(): Filter[] { return this._filters; }

  constructor(private _ws: WorkshopService) {
    console.log('creating dataProvider with', _ws);
    this.dataChangeSource.next([]);
    this._ws.getAll()
      .subscribe(workshops => {
        this.dataChangeSource.next(workshops);
      }, err => {
        console.error(err);
      });
  }

  public get data(): Workshop[] {
    if (!this._filters.length) return this.dataChangeSource.value;

    // Filters exist, so apply dem
    const data = [];
    for (const filter of this._filters) {
      data.push(filter.applyFilter(this.dataChangeSource.value || []));
    }

    const inter = this.dataChangeSource.value.filter(w => {
      let keep = 0;
      for (const filtered of data) {
        if (new Set(filtered).has(w)) keep++;
      }
      return keep === data.length;
    })


    return inter;
  }

  public addFilter(filter: Filter) {
    this._filters.push(filter);
  }

  public removeFilter(filter: Filter) {
    this._filters = this._filters.filter(f => f === filter);
  }

}
