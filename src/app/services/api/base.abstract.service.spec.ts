import { BaseService } from './base.abstract.service';

class MockBaseService extends BaseService {
  constructor() {
    super();
  }
}

describe('BaseService', () => {

  let service: BaseService;

  beforeEach(() => {
    service = new MockBaseService();
  });

  it('should be created', () => {
    expect(service).not.toBeUndefined();
    expect(service.handleError).not.toBeUndefined();
    expect(service.toCamelCase).not.toBeUndefined();
  });

  it(`expect #toCamelCase to camel-case an underscore seperated token (e.g. 'Foo_Bar_Baz__c')`, () => {
    const expected = 'fooBarBaz';
    const token = 'Foo_Bar_Baz';
    expect(service.toCamelCase(token)).toEqual(expected, `expected ${expected}, got ${service.toCamelCase(token)} instead.`);
    const token1 = 'Foo_Bar_Baz__c';
    expect(service.toCamelCase(token1)).toEqual(expected, `expected ${expected}, got ${service.toCamelCase(token1)} instead.`);
  });

});
