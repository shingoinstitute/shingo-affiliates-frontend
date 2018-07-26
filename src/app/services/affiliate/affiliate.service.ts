// Angular Modules
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { RequestOptionsArgs, Headers } from '@angular/http';

// App Modules
import { APIHttpService } from '../http/http.service';
import { BaseAPIService, ISFSuccessResult } from '../api/base-api.abstract.service';
import { CourseManager } from '../../workshops/course-manager.model';
import { Affiliate } from '../../affiliates/affiliate.model';

// RxJS Modules
import { Observable ,  Subject } from 'rxjs';

export const DEFAULT_AFFILIATE_SEARCH_FIELDS: string[] = ['Id', 'Name', 'Languages__c', 'Logo__c', 'Website', 'Summary__c'];

@Injectable()
export class AffiliateService extends BaseAPIService {

  public route = 'affiliates';
  public get baseUrl() { return `${this.APIHost()}/${this.route}`; }

  constructor(public http: APIHttpService) { super(); }

  public getAll() {
    return this.http.get<any[]>(`${this.baseUrl}`)
      .map(res => res.map(afJSON => new Affiliate(afJSON)))
      .catch(this.handleError);
  }

  public getById(id: string): Observable<Affiliate> {
    return this.http.get(`${this.baseUrl}/${id}`)
      .map(res => new Affiliate(res))
      .catch<Affiliate, Affiliate>(this.handleError);
  }

  public create(obj: Affiliate) {
    return this.http.post<ISFSuccessResult>(`${this.baseUrl}`, obj)
      .map(res => res)
      .catch(this.handleError);
  }

  public update(obj: Affiliate) {
    return this.http.put<ISFSuccessResult>(`${this.baseUrl}/${obj.sfId}`, obj)
      .map(res => res)
      .catch(this.handleError);
  }

  public delete(obj: Affiliate) {
    return this.http.delete<ISFSuccessResult>(`${this.baseUrl}/${obj.sfId}`)
      .map(res => res)
      .catch(this.handleError);
  }

  public search(query: string, fields: string[] = DEFAULT_AFFILIATE_SEARCH_FIELDS) {
    const options = {
      ...this.http._defaultReqOpts,
      headers: this.http._defaultReqOpts.headers
        .set('x-search', query)
        .set('x-retrieve', fields.join())
        .set('x-force-refresh', 'true')
    };

    return this.http.get<any[]>(this.baseUrl + '/search', options)
      .map(res => res.map(afJSON => new Affiliate(afJSON)))
      .catch(this.handleError);
  }

  public searchCMS(query: string, id: string) {
    const options = {
      ...this.http._defaultReqOpts,
      headers: this.http._defaultReqOpts.headers
        .set('x-search', query)
        .set('x-retrieve', ['Id', 'Name', 'Email'])
    };

    return this.http.get<any[]>(`${this.baseUrl}/${id}/coursemanagers`, options)
      .map(res => res.map(cmJSON => new CourseManager(cmJSON)))
      .catch(this.handleError);
  }

  public describe(): Observable<any> {
    return super.describe('affiliates', this.http);
  }

  public map(affiliate: Affiliate) {
    return this.http.post<{ mapped?: boolean }>(`${this.baseUrl}/${affiliate.sfId}/map`, affiliate)
      .map(res => {
        if (!res.mapped) {
          throw { error: 'NOT_MAPPED', status: 500 };
        }

        return res as { mapped: true };
      })
      .catch(this.handleError);
  }

}
