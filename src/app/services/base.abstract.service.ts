import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/observable/throw';

export abstract class BaseService {
    protected BaseUrl: string = "http://localhost";
    protected BasePort: string = "8080";

    /** 
     * @description Handles errors from http requests
     */
    protected handleError(error: Response | any): ErrorObservable {
        let err: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            err = body['error'] || JSON.stringify(body);
        } else {
            err = error.message ? error.message : error.toString();
        }
        return Observable.throw(err);
    }

    protected toCamelCase(s: string): string {
        s = s.split('__c').join('').split('_').join(' ');
        return s.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    }
}