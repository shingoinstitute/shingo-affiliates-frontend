import { BaseService } from './base.abstract.service'

class MockBaseService extends BaseService {
  constructor() {
    super()
  }
}

describe('BaseService', () => {
  let service: BaseService

  beforeEach(() => {
    service = new MockBaseService()
  })

  it('should be created', () => {
    expect(service).not.toBeUndefined()
    expect(service.handleError).not.toBeUndefined()
  })
})
