// Angular Modules
import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { RequestOptionsArgs, Headers } from '@angular/http';

// App Modules
import { APIHttpService } from '../http/http.service';
import { BaseAPIService, ISFSuccessResult } from '../api/base-api.abstract.service';
import { Facilitator } from '../../facilitators/facilitator.model';

// RxJS Modules
import { Observable } from 'rxjs';

// RxJS operators



export const DEFAULT_FACILITATOR_SEARCH_FIELDS: string[] = [
  'Id',
  'FirstName',
  'LastName',
  'Name',
  'Email',
  'AccountId',
  'Title',
  'Photograph__c'
];

@Injectable()
export class FacilitatorService extends BaseAPIService {

  public reloadData$ = new EventEmitter<void>();

  public route = 'facilitators';
  public get baseUrl() { return `${this.APIHost()}/${this.route}`; }

  constructor(public http: APIHttpService) { super(); }

  public getAll() {
    return this.http.get<any[]>(this.baseUrl)
      .map(res => res.map(facJSON => new Facilitator(facJSON)))
      .catch(err => this.handleError(err));
  }

  public getById(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`)
      .map(res => new Facilitator(res))
      .catch(err => this.handleError(err));
  }

  public create(obj: Facilitator) {
    const { __name, ...rest } = JSON.parse(JSON.stringify(obj));
    return this.http.post<ISFSuccessResult>(`${this.baseUrl}`, rest)
      .map(res => res)
      .catch(err => this.handleError(err));
  }

  public map(obj: Facilitator) {
    const { __name, ...rest } = JSON.parse(JSON.stringify(obj));
    return this.http.post<ISFSuccessResult>(`${this.baseUrl}/${obj.sfId}`, rest)
      .map(res => res)
      .catch(err => this.handleError(err));
  }

  public update(obj: Facilitator) {
    const { __name, ...rest } = JSON.parse(JSON.stringify(obj));
    return this.http.put<ISFSuccessResult>(`${this.baseUrl}/${obj.sfId}`, rest)
      .map(res => res)
      .catch(err => this.handleError(err));
  }

  public delete(obj: Facilitator) {
    return this.http.delete<ISFSuccessResult>(`${this.baseUrl}/${obj.sfId}`)
      .map(res => res)
      .catch(err => this.handleError(err));
  }

  /**
  * @description Removes service from a facilitator
  */
  public disable(obj: Facilitator) {
    return this.http.delete<ISFSuccessResult>(`${this.baseUrl}/${obj.sfId}/unmap`)
      .map(res => res)
      .catch(err => this.handleError(err));
  }

  /**
   * @description returns a stream of sf Contact objects
   * @param query {string} - the query string
   * @param isMapped {boolean} - returns unmapped facilitators when true, and maped facilitators when false
   */
  public search(query: string, fields: string[] = DEFAULT_FACILITATOR_SEARCH_FIELDS, isMapped: boolean = true) {
    const headers =
      this.http._defaultReqOpts.headers
        .set('x-search', query)
        .set('x-retrieve', fields.join());

    const options = {
      ...this.http._defaultReqOpts,
      headers: !isMapped ? headers.set('x-is-mapped', 'false') : headers
    };

    return this.http.get<any[]>(this.baseUrl + '/search', options)
      .map(res => res.map(facJSON => new Facilitator(facJSON)))
      .catch(err => this.handleError(err));
  }

  public describe(): Observable<Facilitator> {
    return super.describe('facilitators', this.http);
  }

  /**
   * @todo Implement me please
   * @description Sends a reset password email to facilitator (or something like that...)
   */
  public resetPassword(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/resetpassword/${email}`)
      .map(res => res)
      .catch(err => this.handleError(err));
  }

  public changePassword(token: string, password) {
    return this.http.post(`${this.baseUrl}/resetpassword/token`, { token, password })
      .map(res => new Facilitator(res))
      .catch(err => this.handleError(err));
  }

}
