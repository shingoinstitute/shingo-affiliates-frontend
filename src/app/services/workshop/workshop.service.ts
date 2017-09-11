// Angular Modules
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest } from '@angular/common/http';

// App Modules
import { HttpService } from '../http/http.service';
import { BaseAPIService, ISFSuccessResult } from '../api/base-api.abstract.service';
import { Workshop } from '../../workshops/workshop.model';

// RxJS Modules
import { Observable } from 'rxjs/Observable';

// RxJS operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/take';

export { ISFSuccessResult, Workshop };
export const DEFAULT_WORKSHOP_SEARCH_FIELDS: string[] = ['Id', 'Start_Date__c', 'End_Date__c', 'Status__c', 'Workshop_Type__c', 'Organizing_Affiliate__c'];

export type WorkshopProperties = 'actionType'
  | 'workshopType'
  | 'dueDate'
  | 'instructors'
  | 'location'
  | 'verified'
  | 'startDate'
  | 'endDate'
  | 'hostCity'
  | 'hostCountry'
  | 'daysLate'
  | 'status'
  | 'edit'
  | undefined;
export type WorkshopTrackByStrategy = 'id' | 'reference' | 'index';

@Injectable()
export class WorkshopService extends BaseAPIService {

  public get baseUrl() { return `${this.APIHost()}/${this.route}`; }

  public route: string = 'workshops';

  constructor(public http: HttpService) { super(); }

  public getAll(): Observable<Workshop[]> {
    return this.http.get(this.baseUrl)
      .map(res => res.map(wkJSON => new Workshop(wkJSON)))
      .catch(this.handleError);
  }

  public getById(id: string): Observable<Workshop> {
    return this.http.get(this.baseUrl + `/${id}`)
      .map(res => new Workshop(res))
      .catch(this.handleError);
  }

  public create(obj: Workshop): Observable<ISFSuccessResult> {
    return this.http.post(this.baseUrl, obj)
      .map(res => res as ISFSuccessResult)
      .catch(this.handleError);
  }

  public update(obj: Workshop): Observable<ISFSuccessResult> {
    return this.http.put(this.baseUrl + `/${obj.sfId}`, obj)
      .map(res => res as ISFSuccessResult)
      .catch(this.handleError);
  }

  public delete(obj: Workshop): Observable<ISFSuccessResult> {
    return this.http.delete(this.baseUrl + `/${obj.sfId}`)
      .map(res => res as ISFSuccessResult)
      .catch(this.handleError);
  }

  public search(query: string, fields: string[] = DEFAULT_WORKSHOP_SEARCH_FIELDS): Observable<Workshop[]> {
    // Set headers (NOTE: Must include token here)
    let headers = new HttpHeaders().set('x-jwt', this.http.jwt);
    headers = headers.set('x-search', query);
    headers = headers.set('x-retrieve', fields.join());

    return this.http.get(this.baseUrl + '/search', { headers, withCredentials: true })
      .map(res => res.map(wkJSON => new Workshop(wkJSON)))
      .catch(this.handleError);
  }

  public describe(): Observable<any> {
    return super.describe('workshops', this.http);
  }

  public uploadAttendeeFile(id: string, file): Observable<any> {

    const options = this.http._defaultReqOpts;
    const formData: FormData = new FormData();
    formData.append('attendeeList', file, file.name);
    const req = new HttpRequest('POST', `${this.baseUrl}/${id}/attendee_file`, formData, { reportProgress: true, ...options });
    return this.http.request(req);
  }

  public uploadEvaluations(id: string, files: File[]): Observable<any> {
    const options = this.http._defaultReqOpts;
    const formData: FormData = new FormData();
    for (const file of files) {
      formData.append('evaluationFiles', file, file.name);
    }
    const req = new HttpRequest('POST', `${this.baseUrl}/${id}/evaluation_files`, formData, { reportProgress: true, ...options });
    return this.http.request(req);
  }

}
