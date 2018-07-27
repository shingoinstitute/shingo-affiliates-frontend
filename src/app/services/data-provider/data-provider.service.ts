// App Modules
import { Filter } from '../filters/filter.abstract';
import { BaseAPIService } from '../api/base-api.abstract.service';
import { SFObject } from '../../shared/models/sf-object.abstract.model';

// RxJS Modules
import { Observable ,  BehaviorSubject } from 'rxjs';

export class DataProvider<S extends BaseAPIService, T extends SFObject>  {

  public dataChangeSource: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  public _dataLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public _filters: Filter[] = [];

  public get dataChange(): Observable<T[]> { return this.dataChangeSource.asObservable(); }
  public get dataLoading(): Observable<boolean> { return this._dataLoading.asObservable(); }
  public get filters(): Filter[] { return this._filters; }


  constructor(public _s: S) {
    this.dataChangeSource.next([]);
    this.refresh();
  }

  public get data(): T[] {
    if (!this._filters.length) return this.dataChangeSource.value;

    // Filters exist, so apply dem
    const data: Array<T[]> = [];
    for (const filter of this._filters) {
      data.push(filter.applyFilter(this.dataChangeSource.value || []));
    }

    const intersection = this.dataChangeSource.value.filter(w => {
      let keep = 0;
      for (const filtered of data) {
        if (filtered.find(v => v === w)) keep++;
      }
      return keep === data.length;
    });

    return intersection;
  }

  public refresh() {
    this._dataLoading.next(true);
    return this._s.getAll().subscribe(data => {
      this.dataChangeSource.next(data);
      this._dataLoading.next(false);
    }, err => {
      console.warn('caught http error in data-provider', err);
      throw err;
    });
  }

  public addFilter(filter: Filter) {
    this._filters.push(filter);
  }

  public removeFilter(filter: Filter) {
    this._filters = this._filters.filter(f => f === filter);
  }

}
