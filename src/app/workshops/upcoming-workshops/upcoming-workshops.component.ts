import { Component } from '@angular/core'
import { Workshop } from '../../services/workshop/workshop.service'
import { Filter } from '../../services/filters/filter.abstract'
import { WorkshopFilterFactory } from '../../services/filters/workshops/workshop-filter-factory.service'
import { withoutTime } from '../../util/util'
import { WorkshopProperties } from '../workshop-data-table/workshop-data-table.component'

@Component({
  selector: 'app-upcoming-workshops',
  templateUrl: './upcoming-workshops.component.html',
  styleUrls: ['./upcoming-workshops.component.scss'],
})
export class UpcomingWorkshopsComponent {
  public displayedColumns: WorkshopProperties[]
  public filters: Array<Filter<Workshop, any>>

  constructor(public filterFactory: WorkshopFilterFactory) {
    this.displayedColumns = [
      'workshopType',
      'startDate',
      'endDate',
      'location',
      'instructors',
      'verified',
      'actions',
    ]
    const upcomingFilter = filterFactory.createDateRangeFilter()

    upcomingFilter.criteria = [withoutTime(new Date()), null]
    upcomingFilter.active = true

    this.filters = [upcomingFilter]
  }
}
