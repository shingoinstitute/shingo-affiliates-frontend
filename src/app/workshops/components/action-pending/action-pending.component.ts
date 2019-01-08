import { Component } from '@angular/core'

import { Filter } from '~app/services/filters/filter.abstract'
import { WorkshopFilterFactory } from '~app/services/filters/workshops/workshop-filter-factory.service'
import { WorkshopBase } from '~app/workshops/workshop.model'
import { WorkshopProperties } from '../workshop-data-table/workshop-data-table.component'

@Component({
  selector: 'app-action-pending',
  templateUrl: './action-pending.component.html',
  styleUrls: ['./action-pending.component.scss'],
})
export class ActionPendingComponent {
  displayedColumns: WorkshopProperties[] = []
  filters: Array<Filter<WorkshopBase, any>>

  constructor(filterFactory: WorkshopFilterFactory) {
    this.displayedColumns = [
      'actionType',
      'workshopType',
      'dueDate',
      'daysLate',
      'instructors',
      'actions',
    ]
    const propFilter = filterFactory.createPropertyFilter()
    propFilter.setCriteria('Status__c', [
      'Action Pending',
      'Invoiced, Not Paid',
      // 'Finished, waiting for attendee list',
      // 'Awaiting Invoice',
    ])
    propFilter.active = true

    this.filters = [propFilter]
  }
}
