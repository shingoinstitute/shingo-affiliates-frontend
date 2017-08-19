import { Injectable } from '@angular/core';
import { FilterFactory } from '../filter-factory.abstract.service';
import { PropertyFilter } from '../property-filter';
import { TextFilter } from '../text-filter';
import { WorkshopDateRangeFilter } from './workshop-date-range-filter';
import { Workshop } from '../../../workshops/Workshop';

@Injectable()
export class WorkshopFilterFactory extends FilterFactory {

  private static id: number = 0;

  constructor() { super(); }

  createDateRangeFilter(name: string = `WorkshopDateRangeFilter:${WorkshopFilterFactory.id}`): WorkshopDateRangeFilter {
    return new WorkshopDateRangeFilter(name);
  }

  createPropertyFilter(name: string = `WorkshopDateRangeFilter:${WorkshopFilterFactory.id}`): PropertyFilter<Workshop> {
    return new PropertyFilter<Workshop>(name);
  }

  createTextFilter(name: string = `WorkshopDateRangeFilter:${WorkshopFilterFactory.id}`): TextFilter<Workshop> {
    return new TextFilter<Workshop>(name);
  }

}
