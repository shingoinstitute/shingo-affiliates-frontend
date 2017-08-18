import { Injectable } from '@angular/core';
import { FilterFactory } from '../filter-factory.abstract.service';
import { PropertyFilter } from '../property-filter';
import { TextFilter } from '../text-filter';
import { WorkshopDateRangeFilter } from './workshop-date-range-filter';
import { Workshop } from '../../../workshops/Workshop';

@Injectable()
export class WorkshopFilterFactory extends FilterFactory {

  constructor() { super(); }

  createDataRangeFilter(): WorkshopDateRangeFilter {
    return new WorkshopDateRangeFilter();
  }

  createPropertyFilter(): PropertyFilter<Workshop> {
    return new PropertyFilter<Workshop>();
  }

  createTextFilter(): TextFilter<Workshop> {
    return new TextFilter<Workshop>();
  }

}
