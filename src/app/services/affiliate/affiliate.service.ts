// Angular Modules
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { RequestOptionsArgs, Headers } from '@angular/http';

// App Modules
import { HttpService } from '../http/http.service';
import { BaseAPIService, ISFSuccessResult } from '../base-api.abstract.service';
import { CourseManager } from '../../shared/models/CourseManager';
import { Affiliate } from '../../affiliates/Affiliate';

// RxJS Modules
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export const DEFAULT_AFFILIATE_SEARCH_FIELDS: string[] = ['Id', 'Name', 'Languages__c', 'Logo__c', 'Website'];

@Injectable()
export class AffiliateService extends BaseAPIService {

  private route: string = 'affiliates';
  private get baseUrl() { return `${this.APIHost()}/${this.route}`; }

  constructor(private http: HttpService) { super(); }

  public getAll(): Observable<Affiliate[]> {
    return this.http.get(`${this.baseUrl}`)
      .map(res => res.map(afJSON => new Affiliate(afJSON)))
      .catch(this.handleError);
  }

  public getById(id: string): Observable<Affiliate> {
    return this.http.get(`${this.baseUrl}/${id}`)
      .map(res => new Affiliate(res))
      .catch(this.handleError);
  }

  public create(obj: Affiliate): Observable<ISFSuccessResult> {
    return this.http.post(`${this.baseUrl}`, obj)
      .map(res => res)
      .catch(this.handleError);
  }

  public update(obj: Affiliate): Observable<ISFSuccessResult> {
    return this.http.put(`${this.baseUrl}/${obj.sfId}`, obj)
      .map(res => res)
      .catch(this.handleError);
  }

  public delete(obj: Affiliate): Observable<ISFSuccessResult> {
    return this.http.delete(`${this.baseUrl}/${obj.sfId}`)
      .map(res => res)
      .catch(this.handleError);
  }

  public search(query: string, fields: string[] = DEFAULT_AFFILIATE_SEARCH_FIELDS): Observable<Affiliate[]> {
    // Set headers (NOTE: Must include token here)
    let headers = new HttpHeaders().set('x-jwt', this.http.jwt);
    headers = headers.set('x-search', query);
    headers = headers.set('x-retrieve', fields.join());
    headers = headers.set('x-force-refresh', 'true');

    return this.http.get(this.baseUrl + '/search', { headers, withCredentials: true })
      .map(res => res.map(afJSON => new Affiliate(afJSON)))
      .catch(this.handleError);
  }

  public searchCMS(query: string, id: string): Observable<CourseManager[]> {
    // Set headers (NOTE: Must include token here)
    let headers = new HttpHeaders().set('x-jwt', this.http.jwt);
    headers = headers.set('x-search', query);
    headers = headers.set('x-retrieve', ['Id', 'Name', 'Email']);

    return this.http.get(`${this.baseUrl}/${id}/coursemanagers`, { headers, withCredentials: true })
      .map(res => res.map(cmJSON => new CourseManager(cmJSON)))
      .catch(this.handleError);
  }

  public describe(): Observable<any> {
    return super.describe('affiliates', this.http);
  }

  public map(affiliate: Affiliate): Observable<{ mapped: boolean }> {
    return this.http.post(`${this.baseUrl}/${affiliate.sfId}/map`, affiliate)
      .map(res => { if (res.mapped) return res; else throw { error: 'NOT_MAPPED', status: 500 }; })
      .catch(this.handleError);
  }

}
