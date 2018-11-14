import { TextFilter } from './text-filter'

describe('TextFiler', () => {
  let service: TextFilter<any>
  beforeEach(() => {
    service = new TextFilter('filter name')
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('expects an array to be filtered by a string', () => {
    // inform service of new filter 'keyword'
    service.dataChange.next('filter name')

    const data = [
      'filter name',
      'some other filter name',
      'name filter',
      'foo',
      'bar',
      'baz',
    ]

    const fData = service.applyFilter(data)

    expect(fData.length).toEqual(2)
    expect(fData[0]).toEqual('filter name')
    expect(fData[1]).toEqual('some other filter name')
  })
})
