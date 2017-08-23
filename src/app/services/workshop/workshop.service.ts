// Angular Modules
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest } from '@angular/common/http';

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
export const DEFAULT_WORKSHOP_SEARCH_FIELDS: string[] = ['Id', 'Start_Date__c', 'End_Date__c', 'Status__c', 'Workshop_Type__c', 'Organizing_Affiliate__c'];

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
      .map(res => res.map(wkJSON => new Workshop(wkJSON)))
      .catch(this.handleError);
  }

  public getById(id: string): Observable<Workshop> {
    console.log('getting ', id);
    return this.http.get(this.baseUrl + `/${id}`)
      .map(res => { console.log('got', res); return new Workshop(res) })
      .retryWhen(errors => errors.delay(1000).take(3).concat(Observable.throw))
      .catch(this.handleError);
  }

  public create(obj: Workshop): Observable<SFSuccessResult> {
    return this.http.post(this.baseUrl, obj.toSFJSON())
      .map(res => res as SFSuccessResult)
      .catch(this.handleError);
  }

  public update(obj: Workshop): Observable<SFSuccessResult> {
    return this.http.put(this.baseUrl + `/${obj.sfId}`, obj.toSFJSON())
      .map(res => res as SFSuccessResult)
      .retryWhen(errors => errors.delay(1000).take(3).concat(Observable.throw))
      .catch(this.handleError);
  }

  public delete(obj: Workshop): Observable<SFSuccessResult> {
    return this.http.delete(this.baseUrl + `/${obj.sfId}`)
      .map(res => res as SFSuccessResult)
      .retryWhen(errors => errors.delay(1000).take(3).concat(Observable.throw))
      .catch(this.handleError);
  }

  public search(query: string, fields: string[] = DEFAULT_WORKSHOP_SEARCH_FIELDS): Observable<Workshop[]> {
    // Set headers (NOTE: Must include token here)
    let headers = new HttpHeaders().set('x-jwt', this.http.jwt);
    headers = headers.set('x-search', query);
    headers = headers.set('x-retrieve', fields.join());

    return this.http.get(this.baseUrl + '/search', { headers, withCredentials: true })
      .map(res => res.map(wkJSON => new Workshop(wkJSON)))
      .retryWhen(errors => errors.delay(1000).take(3).concat(Observable.throw))
      .catch(this.handleError);
  }

  public describe(): Observable<any> {
    return super.describe('workshops', this.http);
  }

  public uploadAttendeeFile(id: string, file): Observable<any> {
    console.log('file', file);

    const options = this.http._defaultReqOpts;
    let formData: FormData = new FormData();
    formData.append('attendeeList', file, file.name);
    const req = new HttpRequest('POST', `${this.baseUrl}/${id}/attendee_file`, formData, { reportProgress: true, ...options });
    return this.http.request(req);
  }

  public uploadEvaluations(id: string, files: File[]): Observable<any> {
    const options = this.http._defaultReqOpts;
    let formData: FormData = new FormData();
    for (const file of files) {
      formData.append('evaluationFiles', file, file.name);
    }
    const req = new HttpRequest('POST', `${this.baseUrl}/${id}/evaluation_files`, formData, { reportProgress: true, ...options });
    return this.http.request(req);
  }

}
