import { Filter } from './filter.abstract'

export abstract class FilterFactory {
  public abstract createDateRangeFilter(): Filter
  public abstract createPropertyFilter(): Filter
  public abstract createTextFilter(): Filter
}
