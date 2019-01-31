import { DataSource } from '@angular/cdk/table'
import { Observable, merge, EMPTY, combineLatest, of } from 'rxjs'
import { MatPaginator, MatSort } from '@angular/material'
import { map } from 'rxjs/operators'
import { Fn } from './types'
import { id, property } from './functional'
import { Endomorphism } from 'fp-ts/lib/function'

/**
 * A data source that optionally sorts and paginates the given data
 * using a MatPaginator, a MatSort, and a sorting function
 */
export class SortedDataSource<T> extends DataSource<T> {
  /**
   * Constructs a data source
   *
   * If it is desired to use properties of a MatSort in the sortFn, use a closure
   */
  constructor(
    private _data: Observable<T[]>,
    // sometimes you may want to provide a sortFn without a MatSort or MatPaginator
    // but you will rarely provide a matSort without a sortFn
    // therefore it makes sense for the sort function to come first
    // allowing us to elide the matSort parameter when not needed
    private sortFn: Endomorphism<T[]> = id,
    private paginator?: MatPaginator,
    private matSort?: MatSort,
    private disconnectFn: Fn<[Observable<T[]>], void> = () => {},
  ) {
    super()
  }

  get size(): Observable<number> {
    return this._data.pipe(map(property('length')))
  }

  connect(): Observable<T[]> {
    const viewChanges$ = merge(
      (this.paginator && this.paginator.page.asObservable()) || EMPTY,
      (this.matSort && this.matSort.sortChange.asObservable()) || EMPTY,
      // gives an initial value so that latest$ doesn't have to wait for page or sort change
      of(null),
    )

    const latest$ = combineLatest(this._data, viewChanges$)

    return latest$.pipe(
      map(([unsafeData]) => {
        // use slice to copy so that splice does not modify
        const data = this.sortFn(unsafeData.slice())
        if (!this.paginator) return data

        if (data.length <= this.paginator.pageSize) this.paginator.pageIndex = 0

        const startIndex = this.paginator.pageIndex * this.paginator.pageSize

        return data.splice(startIndex, this.paginator.pageSize)
      }),
    )
  }

  disconnect(): void {
    this.disconnectFn(this._data)
  }
}
