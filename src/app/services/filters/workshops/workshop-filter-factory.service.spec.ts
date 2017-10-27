// tslint:disable:prefer-const
import { TestBed, inject } from '@angular/core/testing';

import { WorkshopFilterFactory } from './workshop-filter-factory.service';
import { WorkshopDateRangeFilter } from './workshop-date-range-filter';
import { PropertyFilter } from '../property-filter';
import { TextFilter } from '../text-filter';
import { Filter } from '../filter.abstract';

describe('WorkshopFilterFactory', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkshopFilterFactory]
    });
  });

  it('should be created', inject([WorkshopFilterFactory], (service: WorkshopFilterFactory) => {
    expect(service).toBeDefined();
    expect(service.createDateRangeFilter).toBeDefined();
    expect(service.createPropertyFilter).toBeDefined();
    expect(service.createTextFilter).toBeDefined();
  }));

  describe('factory methods', () => {

    let filter: Filter;

    afterEach(() => {
      expect(filter.name).toEqual('filter name');
    });

    it('expects a WorkshopDateRangeFilter', inject([WorkshopFilterFactory], (service: WorkshopFilterFactory) => {
      filter = service.createDateRangeFilter('filter name');
      expect(filter).toBeTruthy();
      expect(filter instanceof WorkshopDateRangeFilter).toBe(true);
    }));
  
    it('expects a PropertyFilter', inject([WorkshopFilterFactory], (service: WorkshopFilterFactory) => {
      filter = service.createPropertyFilter('filter name');
      expect(filter).toBeTruthy();
      expect(filter instanceof PropertyFilter).toBe(true);
    }));
  
    it('expects a TextFilter', inject([WorkshopFilterFactory], (service: WorkshopFilterFactory) => {
      filter = service.createTextFilter('filter name');
      expect(filter).toBeTruthy();
      expect(filter instanceof TextFilter).toBe(true);
    }));
  });

});
