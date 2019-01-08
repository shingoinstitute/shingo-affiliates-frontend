import { Filter } from './filter.abstract'
import { DateRange } from './workshops/workshop-date-range-filter'
import { PropertyDef } from './property-filter'

export abstract class FilterFactory<T> {
  public abstract createDateRangeFilter(): Filter<T, DateRange>
  public abstract createPropertyFilter(): Filter<T, PropertyDef<T>>
  public abstract createTextFilter(): Filter<T, string>
}
