// App Modules
import { Filter } from '../filters/filter.abstract'
import { BaseAPIService } from '../api/base-api.abstract.service'
import { SFObject } from '../../shared/models/sf-object.abstract.model'

// RxJS Modules
import { Observable, BehaviorSubject, of } from 'rxjs'
import { mergeMap, map } from 'rxjs/operators'
import { EveryFilter } from '../filters/filter-every'

export class DataProvider<S extends BaseAPIService, T extends SFObject> {
  public dataChangeSource: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([])
  public _dataLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true,
  )
  private _filters: Array<Filter<T, any>> = []
  private everyFilter: EveryFilter<T, Array<Filter<T, any>>>

  public get dataChange(): Observable<T[]> {
    return this.dataChangeSource.asObservable()
  }
  public get dataLoading(): Observable<boolean> {
    return this._dataLoading.asObservable()
  }
  public get filters() {
    return this._filters
  }

  constructor(public _s: S) {
    this.dataChangeSource.next([])
    this.refresh()
    this.everyFilter = new EveryFilter('All filters', this._filters)
    this.everyFilter.active = true
  }

  public get size(): Observable<number> {
    return this.data.pipe(map(xs => xs.length))
  }

  public get data(): Observable<T[]> {
    if (!this._filters.length) return this.dataChangeSource.asObservable()

    return this.dataChangeSource.pipe(
      mergeMap(data => this.everyFilter.filter(data)),
    )
  }

  public refresh() {
    this._dataLoading.next(true)
    return this._s.getAll().subscribe(
      data => {
        this.dataChangeSource.next(data)
        this._dataLoading.next(false)
      },
      err => {
        console.warn('caught http error in data-provider', err)
        throw err
      },
    )
  }

  public addFilter(...filters: Array<Filter<T, any>>) {
    this._filters.push(...filters)
    this.everyFilter.criteria = this._filters
  }

  public removeFilter(filter: Filter<T, any>) {
    this._filters = this._filters.filter(f => f === filter)
    this.everyFilter.criteria = this._filters
  }
}
