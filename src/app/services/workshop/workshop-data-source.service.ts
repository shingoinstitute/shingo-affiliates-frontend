// Angular Modules
import { MatPaginator, MatSort } from '@angular/material'

// App Modules
import { WorkshopService } from './workshop.service'
import { DataProvider } from '../data-provider/data-provider.service'
import { APIDataSource } from '../api/api-data-source.abstract.service'
import { Workshop } from '../../workshops/workshop.model'

export class WorkshopDataSource extends APIDataSource<
  WorkshopService,
  Workshop
> {
  constructor(
    public _wdp: DataProvider<WorkshopService, Workshop>,
    public paginator?: MatPaginator,
    public sort?: MatSort,
  ) {
    super(_wdp, paginator, sort)
  }

  protected getSortedData(): Workshop[] {
    const data = this._wdp.data.slice()

    if (!this.sort.active || this.sort.direction === '') {
      return data
    }

    return data.sort((a, b) => {
      let propA: number | string = ''
      let propB: number | string = ''

      switch (this.sort.active) {
        case 'actionType':
          ;[propA, propB] = [a.status, b.status]
          break
        case 'workshopType':
          ;[propA, propB] = [a.type, b.type]
          break
        case 'dueDate':
          ;[propA, propB] = [a.dueDate.valueOf(), b.dueDate.valueOf()]
          break
        case 'instructors':
          ;[propA, propB] = [
            a.instructors && a.instructors.length ? a.instructors.length : -1,
            b.instructors && b.instructors.length ? b.instructors.length : -1,
          ]
          break
        case 'verified':
          ;[propA, propB] = [a.isVerified ? 1 : -1, b.isVerified ? 1 : -1]
          break
        case 'startDate':
          ;[propA, propB] = [a.startDate.valueOf(), b.startDate.valueOf()]
          break
        case 'endDate':
          ;[propA, propB] = [a.endDate.valueOf(), b.endDate.valueOf()]
          break
        case 'hostCity':
          ;[propA, propB] = [a.city, b.city]
          break
        case 'hostCountry':
          ;[propA, propB] = [a.country || '', b.country || '']
          break
        case 'location':
          ;[propA, propB] = [
            (a.city + (a.country || '')).split('/[s,]/').join(''),
            (b.city + (b.country || '')).split('/[s,]/').join(''),
          ]
          break
        case 'status':
          ;[propA, propB] = [a.status, b.status]
          break
      }

      const valueA = isNaN(+propA) ? propA : +propA
      const valueB = isNaN(+propB) ? propB : +propB

      return (
        (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1)
      )
    })
  }
}
