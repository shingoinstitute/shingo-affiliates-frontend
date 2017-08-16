import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/observable/throw';


export interface SFSuccessResult {
    id: string,
    success: boolean,
    errors: any[]
}

export abstract class BaseAPIService {
    protected APIBaseUrl: string = "http://129.123.47.167";
    protected APIBasePort: string = "8080";

    public APIHost() { return `${this.APIBaseUrl}:${this.APIBasePort}`; }

    /** 
     * @description Handles errors from http requests
     */
    handleError(error: Response | any): ErrorObservable {
        let err: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            err = body['error'] || JSON.stringify(body);
        } else {
            err = error.message ? error.message : error.toString();
        }
        return Observable.throw(err);
    }

    // Contract for all APIServices;
    abstract getAll(): Observable<any[]>;
    abstract getById(id: string): Observable<any>;
    abstract create(obj: any): Observable<SFSuccessResult>;
    abstract update(obj: any): Observable<SFSuccessResult>;
    abstract delete(obj: any): Observable<SFSuccessResult>;
    abstract describe(obj: any): Observable<any>;
    abstract search(query: string): Observable<any[]>;

}