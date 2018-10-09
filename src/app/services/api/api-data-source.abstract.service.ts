import { DataSource } from '@angular/cdk/table'
import { MatPaginator, MatSort } from '@angular/material'

import { BaseAPIService } from './base-api.abstract.service'
import { SFObject } from '../../shared/models/sf-object.abstract.model'
import { DataProvider } from '../data-provider/data-provider.service'
import { Filter } from '../filters/filter.abstract'

// RxJS Modules
import { Observable } from 'rxjs'

// RxJS operators

export abstract class APIDataSource<
  S extends BaseAPIService,
  T extends SFObject
> extends DataSource<T> {
  public get size(): number {
    return this._dp.data.length
  }

  constructor(
    public _dp: DataProvider<S, T>,
    public paginator?: MatPaginator,
    public sort?: MatSort,
  ) {
    super()
  }

  public connect(): Observable<T[]> {
    const changes = [
      this._dp,
      this.paginator,
      this.sort,
      ...this._dp.filters,
    ].filter(change => !!change)
    const dataChanges = changes.map(change => {
      if (change instanceof DataProvider || change instanceof Filter) {
        return change.dataChange
      } else if (change instanceof MatPaginator) {
        return change.page
      } else if (change instanceof MatSort) {
        return change.sortChange
      }
    })

    return Observable.merge(...dataChanges).map(() => {
      const data = this.getSortedData()

      if (this.size <= this.paginator.pageSize) this.paginator.pageIndex = 0

      const startIndex = this.paginator.pageIndex * this.paginator.pageSize
      return data.splice(startIndex, this.paginator.pageSize)
    })
  }

  public addFilters(filters: Filter[]): void {
    for (const filter of filters) {
      this._dp.addFilter(filter)
    }
  }

  public disconnect(): void {
    /* do nothing */
  }

  protected abstract getSortedData(): T[]
}
