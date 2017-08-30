import { Component } from '@angular/core';

import { WorkshopProperties } from '../../../services/workshop/workshop.service';
import { WorkshopFilterFactory } from '../../../services/filters/workshops/workshop-filter-factory.service';
import { Filter } from '../../../services/filters/filter.abstract';

@Component({
  selector: 'app-action-pending',
  templateUrl: './action-pending.component.html',
  styleUrls: ['./action-pending.component.scss']
})
export class ActionPendingComponent {

  private displayedColumns: WorkshopProperties[] = [];
  private filters: Filter[];

  constructor(private filterFactory: WorkshopFilterFactory) {
    this.displayedColumns = ['actionType', 'workshopType', 'dueDate', 'daysLate', 'instructors'];
    const propFilter = filterFactory.createPropertyFilter();
    propFilter.dataChange.next({ key: 'status', value: ['Action Pending', 'Invoiced, Not Paid', 'Finished, waiting for attendee list', 'Awaiting Invoice'] });

    this.filters = [propFilter];
  }

}
