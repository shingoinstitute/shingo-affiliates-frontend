import { TestBed, inject } from '@angular/core/testing';
import { PropertyFilter } from './property-filter';

describe('PropertyFilter', () => {

  let service: PropertyFilter<any>;
  beforeEach(() => {
    service = new PropertyFilter<any>('filter name');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('expects #applyFilter to return unmodified data when PropertyFilter::filter is undefined or null', () => {
    expect(service._filter).not.toBeTruthy();
    const data = [1, 2, 3, 4];
    const fData = service.applyFilter(data);
    expect(Array.isArray(fData)).toEqual(true);
    expect(data).toEqual(fData);
  });

  it('expects #applyFilter to apply filter to data matching a key-value pair', () => {
    let filter: { key: string, value: any };
    let data: any[];

    filter = { key: 'some key', value: 'some value' };

    // update value of service._filter
    service.dataChange.next(filter);

    data = [
      { 'some key': 'some value' },
      { 'some other key': 'some other value' }
    ];

    // filtered data
    const fData = service.applyFilter(data);
    
    // fData should only have 1 element of value `{ 'some key': 'some value' }`
    expect(fData.length).toEqual(1);
    expect(fData[0]).toEqual({ 'some key': 'some value' });
  });

  it('expects #applyFilter to apply filter to data matching a key and multiple values', () => {
    let filter: { key: string, value: any };
    let data: any[];

    // create new filter where _filter.value is an array of values to match against some input
    filter = { key: 'some key', value: [1, 2] };
    // inform service of the new filter
    service.dataChange.next(filter);

    // create new data object to conform to the new filter
    data = [
      { 'some key': 1 },
      { 'some key': 2 },
      { 'some key': 3 },
      { 'some other key': 1 }
    ];

    const fData = service.applyFilter(data);

    // expect fData to have 2 elements with values that equal 1 and 2
    expect(fData.length).toEqual(2);
    expect(fData[0]).toEqual({ 'some key': 1 });
    expect(fData[1]).toEqual({ 'some key': 2 });
  });

});