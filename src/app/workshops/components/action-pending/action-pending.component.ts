import { Component } from '@angular/core'

import {
  WorkshopProperties,
  Workshop,
} from '~app/services/workshop/workshop.service'
import { Filter } from '~app/services/filters/filter.abstract'
import { WorkshopFilterFactory } from '~app/services/filters/workshops/workshop-filter-factory.service'

@Component({
  selector: 'app-action-pending',
  templateUrl: './action-pending.component.html',
  styleUrls: ['./action-pending.component.scss'],
})
export class ActionPendingComponent {
  public displayedColumns: WorkshopProperties[] = []
  public filters: Array<Filter<Workshop, any>>

  constructor(public filterFactory: WorkshopFilterFactory) {
    this.displayedColumns = [
      'actionType',
      'workshopType',
      'dueDate',
      'daysLate',
      'instructors',
      'actions',
    ]
    const propFilter = filterFactory.createPropertyFilter()
    propFilter.criteria = {
      key: 'status',
      value: [
        'Action Pending',
        'Invoiced, Not Paid',
        'Finished, waiting for attendee list',
        'Awaiting Invoice',
      ],
    }
    propFilter.active = true

    this.filters = [propFilter]
  }
}
