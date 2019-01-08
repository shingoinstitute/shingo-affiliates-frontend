import { Component } from '@angular/core'
import { Filter } from '~app/services/filters/filter.abstract'
import { WorkshopFilterFactory } from '~app/services/filters/workshops/workshop-filter-factory.service'
import { withoutTime } from '~app/util/util'
import { WorkshopBase } from '~app/workshops/workshop.model'
import { WorkshopProperties } from '../workshop-data-table/workshop-data-table.component'

@Component({
  selector: 'app-upcoming-workshops',
  templateUrl: './upcoming-workshops.component.html',
  styleUrls: ['./upcoming-workshops.component.scss'],
})
export class UpcomingWorkshopsComponent {
  displayedColumns: WorkshopProperties[]
  filters: Array<Filter<WorkshopBase, any>>

  constructor(filterFactory: WorkshopFilterFactory) {
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
