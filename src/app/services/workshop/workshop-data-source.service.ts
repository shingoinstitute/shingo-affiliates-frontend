// Angular Modules
import { MatPaginator, MatSort } from '@angular/material'

// App Modules
import { WorkshopService } from '~app/workshops/services/workshop.service'
import { DataProvider } from '../data-provider/data-provider.service'
import { APIDataSource } from '../api/api-data-source.abstract.service'
import {
  WorkshopBase,
  status,
  type,
  dueDate,
  instructors,
  isVerified,
  startDate,
  endDate,
  city,
  country,
  location,
} from '../../workshops/workshop.model'
import {
  ordString,
  ordNumValue,
  ordNumber,
  ordBoolean,
  unsafeCompare,
} from '~app/util/functional/Ord'
import { pipe } from '~app/util/functional'
import { Ordering, invert } from '~app/util/functional/Ordering'
import { WorkshopProperties } from '~app/workshops/components/workshop-data-table/workshop-data-table.component'

export type WorkshopTrackByStrategy = 'id' | 'reference' | 'index'

export class WorkshopDataSource extends APIDataSource<
  WorkshopService,
  WorkshopBase
> {
  constructor(
    _wdp: DataProvider<WorkshopService, WorkshopBase>,
    paginator: MatPaginator,
    public sort: MatSort,
  ) {
    super(_wdp, paginator, sort)
  }

  protected _sortFn(data: WorkshopBase[]): WorkshopBase[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data
    }

    return data.sort(
      pipe(
        (a, b): Ordering => {
          switch (this.sort.active as WorkshopProperties) {
            case 'actionType':
              return ordString.compare(status(a) || '')(status(b) || '')
            case 'workshopType':
              return ordString.compare(type(a) || '')(type(b) || '')
            case 'dueDate':
              return ordNumValue.compare(dueDate(a))(dueDate(b))
            case 'instructors': {
              const instructorsA = instructors(a)
              const instructorsB = instructors(b)
              const [propA, propB] = [
                instructorsA ? instructorsA.length : 0,
                instructorsB ? instructorsB.length : 0,
              ]
              return ordNumber.compare(propA)(propB)
            }
            case 'verified':
              return ordBoolean.compare(isVerified(a))(isVerified(b))
            case 'startDate':
              return ordNumValue.compare(startDate(a))(startDate(b))
            case 'endDate':
              return ordNumValue.compare(endDate(a))(endDate(b))
            case 'hostCity':
              return ordString.compare(city(a) || '')(city(b) || '')
            case 'hostCountry':
              return ordString.compare(country(a) || '')(country(b) || '')
            case 'location':
              return ordString.compare(location(a))(location(b))
            case 'status':
              return ordString.compare(status(a) || '')(status(b) || '')
            default:
              return unsafeCompare(a)(b)
          }
        },
        value => (this.sort.direction === 'asc' ? value : invert(value)),
      ),
    )
  }
}
