import { Injectable } from '@angular/core'
import { FilterFactory } from '../filter-factory.abstract.service'
import { PropertyFilter } from '../property-filter'
import { TextFilter } from '../text-filter'
import { WorkshopDateRangeFilter } from './workshop-date-range-filter'
import { WorkshopBase } from '../../../workshops/workshop.model'

@Injectable()
export class WorkshopFilterFactory extends FilterFactory<WorkshopBase> {
  public static id = 0

  constructor() {
    super()
  }

  public createDateRangeFilter(
    name: string = `WorkshopDateRangeFilter:${WorkshopFilterFactory.id}`,
  ): WorkshopDateRangeFilter {
    WorkshopFilterFactory.id++
    return new WorkshopDateRangeFilter(name)
  }

  public createPropertyFilter(
    name: string = `WorkshopPropertyFilter:${WorkshopFilterFactory.id}`,
  ): PropertyFilter<WorkshopBase> {
    WorkshopFilterFactory.id++
    return new PropertyFilter<WorkshopBase>(name)
  }

  public createTextFilter(
    name: string = `WorkshopTextFilter:${WorkshopFilterFactory.id}`,
  ): TextFilter<WorkshopBase> {
    WorkshopFilterFactory.id++
    return new TextFilter<WorkshopBase>(name)
  }
}
