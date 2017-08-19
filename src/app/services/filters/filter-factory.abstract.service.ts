import { Filter } from './filter.abstract';

export abstract class FilterFactory {
    abstract createDateRangeFilter(): Filter;
    abstract createPropertyFilter(): Filter;
    abstract createTextFilter(): Filter;
}