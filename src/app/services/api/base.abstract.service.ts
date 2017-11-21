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
    if (error.error && typeof error.error === 'string') {
      try {
        error.error = this.parseErrResponse(error);
        if (error.error === '') {
          error.error = error.message;
        }
      } catch (e) {
        console.warn(e);
      }
    }
    return Observable.throw(error);
  }

  public toCamelCase(s: string): string {
    s = s.split('__c').join('').split('_').join(' ');
    return s.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
  }

  /**
   * parseErrResponse
   * 
   * Error responses from the API like to change error objects into JSON strings
   * for some reason. This method attempts to un-stringify the error object
   * so that a useful error code can be extracted from the response.
   * 
   * For instance, the below response object:
   * {
   *  error: "\{\"error\":\"something terrible has happened\"\}",
   * }
   * 
   * should become:
   * 
   * {
   *  error: {
   *    error: "something terrible has happened"
   *  }
   * }
   * 
   */
  public parseErrResponse(obj: object): string {
    const key = 'error';
    while (obj.hasOwnProperty(key)) {
      obj = obj[key];
      if (typeof obj === 'string') {
        const message: string = obj;
        if (message.match(/\{.*\}/g)) {
          try {
            obj = JSON.parse(message);
            console.warn(obj);
          } catch (e) {
            return '';
          }
        } else {
          return message;
        }
      }
    }
    return '';
  }
}