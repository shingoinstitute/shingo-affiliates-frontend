// import { Observable } from 'rxjs/Observable';
// import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
// import 'rxjs/add/observable/throw';

// export abstract class BaseService {
//   protected _baseUrl: string = 'http://localhost';
//   protected _basePort: string = '8080';

//   /** 
//    * @description Handles errors from http requests
//    */
//   protected handleError(error: Response | any): ErrorObservable {
//     console.warn('got an http error', error);
//     return Observable.throw(error);
//   }

//   protected toCamelCase(s: string): string {
//     s = s.split('__c').join('').split('_').join(' ');
//     return s.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
//       return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
//     }).replace(/\s+/g, '');
//   }
// }

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

  it(`expects 'toCamelCase' to camel-case an underscore seperated token (e.g. 'Foo_Bar_Baz__c')`, () => {
    const expected = 'fooBarBaz';
    const token = 'Foo_Bar_Baz';
    expect(service.toCamelCase(token)).toEqual(expected, `expected ${expected}, got ${service.toCamelCase(token)} instead.`);
    const token1 = 'Foo_Bar_Baz__c';
    expect(service.toCamelCase(token1)).toEqual(expected, `expected ${expected}, got ${service.toCamelCase(token1)} instead.`);
  });

});
