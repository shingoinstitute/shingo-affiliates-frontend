// Angular Modules
import { MatPaginator, MatSort } from '@angular/material'

// App Modules
import { AffiliateService } from './affiliate.service'
import { DataProvider } from '../data-provider/data-provider.service'
import { APIDataSource } from '../api/api-data-source.abstract.service'
import { Affiliate } from '../../affiliates/affiliate.model'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export class AffiliateDataSource extends APIDataSource<
  AffiliateService,
  Affiliate
> {
  constructor(
    _adp: DataProvider<AffiliateService, Affiliate>,
    paginator: MatPaginator,
    public sort?: MatSort,
  ) {
    super(_adp, paginator, sort)
  }

  protected _sortFn(data: Affiliate[]): Affiliate[] {
    if (!this.sort) return data
    const sort = this.sort

    if (!this.sort.active || this.sort.direction === '') {
      return data
    }

    return data.sort((a, b) => {
      let propA: number | string = ''
      let propB: number | string = ''

      switch (sort.active) {
        case 'name':
          ;[propA, propB] = [a.name, b.name]
          break
        case 'website':
          ;[propA, propB] = [a.website, b.website]
          break
        default:
          ;[propA, propB] = [a.name, b.name]
      }

      const valueA = isNaN(+propA) ? propA : +propA
      const valueB = isNaN(+propB) ? propB : +propB

      return (valueA < valueB ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1)
    })
  }
}
