import { Component } from '@angular/core';
import { WorkshopProperties } from '../../services/workshop/workshop.service';
import { Filter } from '../../services/filters/filter.abstract';
import { WorkshopFilterFactory } from '../../services/filters/workshops/workshop-filter-factory.service';

@Component({
  selector: 'app-upcoming-workshops',
  templateUrl: './upcoming-workshops.component.html',
  styleUrls: ['./upcoming-workshops.component.scss']
})
export class UpcomingWorkshopsComponent {

  public displayedColumns: WorkshopProperties[];
  public filters: Filter[];

  constructor(public filterFactory: WorkshopFilterFactory) {
    this.displayedColumns = [
      'workshopType',
      'startDate',
      'endDate',
      'location',
      'instructors',
      'verified'
    ];
    const upcomingFilter = filterFactory.createDateRangeFilter();

    upcomingFilter.dataChange.next([new Date().withoutTime(), null]);

    this.filters = [upcomingFilter];
  }

}
