import { Component } from '@angular/core'
import {
  WorkshopProperties,
  Workshop,
} from '~app/services/workshop/workshop.service'
import { Filter } from '~app/services/filters/filter.abstract'
import { WorkshopFilterFactory } from '~app/services/filters/workshops/workshop-filter-factory.service'
import { withoutTime } from '~app/util/util'

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
