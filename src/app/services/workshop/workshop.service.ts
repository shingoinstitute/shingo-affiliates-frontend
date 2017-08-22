// Angular Modules
import { Injectable } from '@angular/core';
import { RequestOptionsArgs, Headers } from '@angular/http';

// App Modules
import { HttpService } from '../http/http.service';
import { BaseAPIService, SFSuccessResult } from '../base-api.abstract.service';
import { Workshop } from '../../workshops/Workshop';

// RxJS Modules
import { Observable } from 'rxjs/Observable';

// RxJS operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/take';

export { SFSuccessResult, Workshop }
export const DEFAULT_WORKSHOP_SEARCH_FIELDS: string[] = ['Id', 'Start_Date__c', 'End_Date__c', 'Status__c', 'Workshop_Type__c', 'Organizing_Affilaite__c'];

export type WorkshopProperties = 'actionType' | 'workshopType' | 'dueDate' | 'instructors' | 'location' | 'verified' | 'startDate' | 'endDate' | 'hostCity' | 'hostCountry' | 'daysLate' | 'status' | 'edit' | undefined;
export type WorkshopTrackByStrategy = 'id' | 'reference' | 'index';

@Injectable()
export class WorkshopService extends BaseAPIService {

  private route: string = 'workshops';
  private get baseUrl() { return `${this.APIHost()}/${this.route}`; }

  constructor(private http: HttpService) { super(); console.log('creating workshopService with', http); }

  public getAll(): Observable<Workshop[]> {
    console.log('calling getAll() on ws');
    if (!this.http.get(this.baseUrl)) console.error(`http.get(${this.baseUrl}) didn't work!`, this.http);
    return this.http.get(this.baseUrl)
      .map(res => res.json().map(wkJSON => new Workshop(wkJSON)))
      .catch(this.handleError);
  }

  public getById(id: string): Observable<Workshop> {
    console.log('getting ', id);
    return this.http.get(this.baseUrl + `/${id}`)
      .map(res => { console.log('got', res.json()); return new Workshop(res.json()) })
      .retryWhen(errors => errors.delay(1000).take(3).concat(Observable.throw))
      .catch(this.handleError);
  }

  public create(obj: Workshop): Observable<SFSuccessResult> {
    return this.http.post(this.baseUrl, obj.toSFJSON())
      .map(res => res.json() as SFSuccessResult)
      .catch(this.handleError);
  }

  public update(obj: Workshop): Observable<SFSuccessResult> {
    return this.http.put(this.baseUrl + `/${obj.sfId}`, obj.toSFJSON())
      .map(res => res.json() as SFSuccessResult)
      .retryWhen(errors => errors.delay(1000).take(3).concat(Observable.throw))
      .catch(this.handleError);
  }

  public delete(obj: Workshop): Observable<SFSuccessResult> {
    return this.http.delete(this.baseUrl + `/${obj.sfId}`)
      .map(res => res.json() as SFSuccessResult)
      .retryWhen(errors => errors.delay(1000).take(3).concat(Observable.throw))
      .catch(this.handleError);
  }

  public search(query: string, fields: string[] = DEFAULT_WORKSHOP_SEARCH_FIELDS): Observable<Workshop[]> {
    // Set headers (NOTE: Must include token here)
    const headers = new Headers();
    headers.set('x-jwt', this.http.jwt);
    headers.set('x-search', query);
    headers.set('x-retrieve', fields.join());

    return this.http.get(this.baseUrl + '/search', { headers, withCredentials: true } as RequestOptionsArgs)
      .map(res => res.json().map(wkJSON => new Workshop(wkJSON)))
      .retryWhen(errors => errors.delay(1000).take(3).concat(Observable.throw))
      .catch(this.handleError);
  }

  public describe(): Observable<any> {
    return super.describe('workshops', this.http);
  }

}
