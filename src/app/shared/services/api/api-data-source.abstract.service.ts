import {
  merge as observableMerge,
  Observable,
  empty,
  combineLatest,
} from 'rxjs'

import { map, startWith } from 'rxjs/operators'
import { DataSource } from '@angular/cdk/table'
import { MatPaginator, MatSort } from '@angular/material'

import { DataProvider } from '../data-provider/data-provider.service'
import { Filter } from '../filters/filter.abstract'

// RxJS operators

export abstract class APIDataSource<T> extends DataSource<T> {
  constructor(
    public _dp: DataProvider<T>,
    public paginator: MatPaginator,
    public sort?: MatSort,
  ) {
    super()
  }

  public connect(): Observable<T[]> {
    const viewChanges$ = observableMerge(
      this.paginator.page.asObservable(),
      (this.sort && this.sort.sortChange.asObservable()) || empty(),
    ).pipe(startWith(null))

    const latest$ = combineLatest(this._dp.data, viewChanges$)

    return latest$.pipe(
      map(([data]) => this._sortFn(data.slice())),
      map(data => {
        if (data.length <= this.paginator.pageSize) this.paginator.pageIndex = 0

        const startIndex = this.paginator.pageIndex * this.paginator.pageSize
        return data.splice(startIndex, this.paginator.pageSize)
      }),
    )
  }

  public addFilters(filters: Array<Filter<T, any>>): void {
    this._dp.addFilter(...filters)
  }

  public disconnect(): void {
    /* do nothing */
  }

  protected abstract _sortFn(data: T[]): T[]
}
