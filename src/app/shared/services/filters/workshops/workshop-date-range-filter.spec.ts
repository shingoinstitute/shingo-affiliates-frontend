// tslint:disable:prefer-const
import { TestBed, inject } from '@angular/core/testing'
import { WorkshopDateRangeFilter } from './workshop-date-range-filter'
import { Workshop } from '../../workshop/workshop.service'

describe('WorkshopDateRangeFilter', () => {
  let filter: WorkshopDateRangeFilter

  const mockWorkshops = [
    new Workshop({ Start_Date__c: '1/1/2000', End_Date__c: '1/2/2000' }),
    new Workshop({ Start_Date__c: '1/2/2000', End_Date__c: '1/3/2000' }),
    new Workshop({ Start_Date__c: '1/3/2000', End_Date__c: '1/4/2000' }),
    new Workshop({ Start_Date__c: '1/4/2000', End_Date__c: '1/5/2000' }),
  ]

  beforeEach(() => {
    filter = new WorkshopDateRangeFilter('filter name')
  })

  it(`expects filtered workshops' start dates to be >= '1/1/2000'`, () => {
    // notify filter of new date range
    const range: DateRange = [new Date('1/2/2000'), null]
    filter.dataChange.next(range)

    // apply filter to mock workshops
    const filteredWorkshops = filter.applyFilter(mockWorkshops)

    expect(filteredWorkshops).toBeDefined()
    expect(filteredWorkshops.length).toBe(3)
    expect(filteredWorkshops[0].startDate.valueOf()).toBeGreaterThanOrEqual(
      new Date('1/2/2000').valueOf(),
    )
    expect(filteredWorkshops[1].startDate.valueOf()).toBeGreaterThanOrEqual(
      new Date('1/2/2000').valueOf(),
    )
    expect(filteredWorkshops[2].startDate.valueOf()).toBeGreaterThanOrEqual(
      new Date('1/2/2000').valueOf(),
    )
  })

  it(`expects filtered workshops' start dates to be < '1/2/2000'`, () => {
    // notify filter of new date range
    const range: DateRange = [null, new Date('1/3/2000')]
    filter.dataChange.next(range)

    // apply filter to mock workshops
    const filteredWorkshops = filter.applyFilter(mockWorkshops)

    expect(filteredWorkshops).toBeDefined()
    expect(filteredWorkshops.length).toBe(2)
    expect(filteredWorkshops[0].startDate.valueOf()).toBeLessThan(
      new Date('1/3/2000').valueOf(),
    )
    expect(filteredWorkshops[1].startDate.valueOf()).toBeLessThan(
      new Date('1/3/2000').valueOf(),
    )
  })

  it(`expects filtered workshops' start dates to be >= '1/1/2000' AND to be < '1/4/2000'`, () => {
    // notify filter of new date range
    const range: DateRange = [new Date('1/2/2000'), new Date('1/4/2000')]
    filter.dataChange.next(range)

    // apply filter to mock workshops
    const filteredWorkshops = filter.applyFilter(mockWorkshops)

    expect(filteredWorkshops).toBeDefined()
    expect(filteredWorkshops.length).toBe(2)
  })

  it(`expects '1/1/2000 12:00:00' to be >= to '1/1/2000 00:00:00' without time`, () => {
    const a = new Date('Sat Jan 01 2000 12:00:00 GMT-0700 (MST)')
    const b = new Date('Sat Jan 01 2000 00:00:00 GMT-0700 (MST)')

    expect(a.valueOf()).toBeGreaterThan(b.valueOf())
    expect(filter.greaterThanWithoutTime(a, b)).toBe(true)
    expect(filter.greaterThanWithoutTime(b, a)).toBe(true)
  })

  it(`expects '1/1/2000 00:00:00' to be <= to '1/1/2000 12:00:00' without time`, () => {
    const a = new Date('Sat Jan 01 2000 00:00:00 GMT-0700 (MST)')
    const b = new Date('Sat Jan 01 2000 12:00:00 GMT-0700 (MST)')

    expect(a.valueOf()).toBeLessThan(b.valueOf())
    expect(filter.lessThanWithoutTime(a, b)).toBe(true)
    expect(filter.lessThanWithoutTime(b, a)).toBe(true)
  })

  it(`expects '2/1/2000' to be greater than '1/1/2000'`, () => {
    const a = new Date('2/1/2000')
    const b = new Date('1/1/2000')

    expect(a.valueOf()).toBeGreaterThan(b.valueOf())
    expect(filter.greaterThanWithoutTime(a, b)).toBe(true)
    expect(filter.greaterThanWithoutTime(b, a)).toBe(false)
  })

  it(`expects '1/1/2000' to be less than '1/1/2000'`, () => {
    const a = new Date('1/1/2000')
    const b = new Date('2/1/2000')

    expect(a.valueOf()).toBeLessThan(b.valueOf())
    expect(filter.lessThanWithoutTime(a, b)).toBe(true)
    expect(filter.lessThanWithoutTime(b, a)).toBe(false)
  })
})
