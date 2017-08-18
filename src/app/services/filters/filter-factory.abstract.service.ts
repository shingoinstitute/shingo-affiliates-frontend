import { Filter } from './filter.abstract';

export abstract class FilterFactory {
    abstract createDataRangeFilter(): Filter;
    abstract createPropertyFilter(): Filter;
    abstract createTextFilter(): Filter;
}