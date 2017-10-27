import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/observable/throw';

export abstract class BaseService {
  protected _baseUrl: string = 'http://localhost';
  protected _basePort: string = '8080';

  /** 
   * @description Handles errors from http requests
   */
  public handleError(error: Response | any): ErrorObservable {
    console.warn('got an http error', error);
    return Observable.throw(error);
  }

  public toCamelCase(s: string): string {
    s = s.split('__c').join('').split('_').join(' ');
    return s.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
  }
}