// Angular Modules
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest } from '@angular/common/http';

// App Modules
import { APIHttpService } from '../http/http.service';
import { BaseAPIService, ISFSuccessResult } from '../api/base-api.abstract.service';
import { Workshop } from '../../workshops/workshop.model';

// RxJS Modules
import { Observable } from 'rxjs';

// RxJS operators






export { ISFSuccessResult, Workshop };
export const DEFAULT_WORKSHOP_SEARCH_FIELDS: string[] = [
  'Id',
  'Start_Date__c',
  'End_Date__c',
  'Status__c',
  'Workshop_Type__c',
  'Organizing_Affiliate__c'
];

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
  | 'actions'
  | undefined;
export type WorkshopTrackByStrategy = 'id' | 'reference' | 'index';

@Injectable()
export class WorkshopService extends BaseAPIService {

  public get baseUrl() { return `${this.APIHost()}/${this.route}`; }

  public route = 'workshops';

  constructor(public http: APIHttpService) { super(); }

  public getAll() {
    return this.http.get<any[]>(this.baseUrl)
      .map(res => res.map(wkJSON => new Workshop(wkJSON)))
      .catch(this.handleError);
  }

  public getById(id: string) {
    return this.http.get(this.baseUrl + `/${id}`)
      .map(res => new Workshop(res))
      .catch(this.handleError);
  }

  public create(obj: Workshop) {
    return this.http.post<ISFSuccessResult>(this.baseUrl, obj)
      .catch(this.handleError);
  }

  public update(obj: Workshop) {
    return this.http.put<ISFSuccessResult>(this.baseUrl + `/${obj.sfId}`, obj)
      .catch(this.handleError);
  }

  public delete(obj: Workshop) {
    return this.http.delete<ISFSuccessResult>(this.baseUrl + `/${obj.sfId}`)
      .catch(this.handleError);
  }

  public search(query: string, fields: string[] = DEFAULT_WORKSHOP_SEARCH_FIELDS) {
    const options = {
      ...this.http._defaultReqOpts,
      headers: this.http._defaultReqOpts.headers
        .set('x-search', query)
        .set('x-retrieve', fields.join())
    };

    return this.http.get<any[]>(this.baseUrl + '/search', options)
      .map(res => res.map(wkJSON => new Workshop(wkJSON)))
      .catch(this.handleError);
  }

  public describe(): Observable<any> {
    return super.describe('workshops', this.http);
  }

  // FIXME: Fix stupid overly broad type
  public uploadAttendeeFile(id: string, file: File): Observable<any> {
    const options = { ...this.http._defaultReqOpts, reportProgress: true };
    const formData: FormData = new FormData();
    formData.append('attendeeList', file, file.name);
    return this.http.post(`${this.baseUrl}/${id}/attendee_file`, formData, options);
  }

  public uploadEvaluations(id: string, files: File[]): Observable<any> {
    const options = { ...this.http._defaultReqOpts, reportProgress: true };
    const formData: FormData = new FormData();
    for (const file of files) {
      formData.append('evaluationFiles', file, file.name);
    }
    return this.http.post(`${this.baseUrl}/${id}/evaluation_files`, formData, options);
  }

  public cancel(workshop: Workshop, reason: string): Observable<any> {
    return this.http.put(this.baseUrl + `/${workshop.sfId}/cancel`, { reason })
      .catch(this.handleError);
  }

}
