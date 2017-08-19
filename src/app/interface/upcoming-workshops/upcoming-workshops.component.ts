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

    private displayedColumns: WorkshopProperties[];
    private filters: Filter[];

    constructor(private filterFactory: WorkshopFilterFactory) {
        this.displayedColumns = [
            'workshopType',
            'startDate',
            'endDate',
            'location',
            'instructors',
            'verified'
        ];
        const upcomingFilter = filterFactory.createDateRangeFilter();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        upcomingFilter.dataChange.next([today, null]);

        this.filters = [upcomingFilter];
    }

}
