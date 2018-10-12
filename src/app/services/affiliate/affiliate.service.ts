
import {catchError, map} from 'rxjs/operators';
import { Observable } from 'rxjs';
// Angular Modules
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RequestOptionsArgs, Headers } from '@angular/http';

// App Modules
import { BaseAPIService, ISFSuccessResult } from '../api/base-api.abstract.service';
import { CourseManager } from '../../workshops/course-manager.model';
import { Affiliate } from '../../affiliates/affiliate.model';

// RxJS Modules
import { JWTService } from '../auth/auth.service';
import { requestOptions } from '../../util/util';
import { tuple } from '../../util/functional';

export const DEFAULT_AFFILIATE_SEARCH_FIELDS: string[] = ['Id', 'Name', 'Languages__c', 'Logo__c', 'Website', 'Summary__c'];

@Injectable()
export class AffiliateService extends BaseAPIService {

  public route = 'affiliates';
  public get baseUrl() { return `${this.APIHost()}/${this.route}`; }

  constructor(public http: HttpClient, private jwt: JWTService) { super(); }

  public getAll() {
    return this.http.get<any[]>(`${this.baseUrl}`, requestOptions(this.jwt)).pipe(
      map(res => res.map(afJSON => new Affiliate(afJSON))),
      catchError(this.handleError),);
  }

  public getById(id: string): Observable<Affiliate> {
    return this.http.get(`${this.baseUrl}/${id}`, requestOptions(this.jwt)).pipe(
      map(res => new Affiliate(res)),
      catchError<Affiliate, Affiliate>(this.handleError),);
  }

  public create(obj: Affiliate) {
    return this.http.post<ISFSuccessResult>(`${this.baseUrl}`, obj, requestOptions(this.jwt)).pipe(
      map(res => res),
      catchError(this.handleError),);
  }

  public update(obj: Affiliate) {
    return this.http.put<ISFSuccessResult>(`${this.baseUrl}/${obj.sfId}`, obj, requestOptions(this.jwt)).pipe(
      map(res => res),
      catchError(this.handleError),);
  }

  public delete(obj: Affiliate) {
    return this.http.delete<ISFSuccessResult>(`${this.baseUrl}/${obj.sfId}`, requestOptions(this.jwt)).pipe(
      map(res => res),
      catchError(this.handleError),);
  }

  public search(query: string, fields: string[] = DEFAULT_AFFILIATE_SEARCH_FIELDS) {
    const options =
      requestOptions(this.jwt,
        tuple('x-search', query),
        tuple('x-retrieve', fields),
        tuple('x-force-refresh', 'true')
      );

    return this.http.get<any[]>(this.baseUrl + '/search', options).pipe(
      map(res => res.map(afJSON => new Affiliate(afJSON))),
      catchError(this.handleError),);
  }

  public searchCMS(query: string, id: string) {
    const options = requestOptions(this.jwt,
      tuple('x-search', query),
      tuple('x-retrieve', ['Id', 'Name', 'Email'])
    );

    return this.http.get<any[]>(`${this.baseUrl}/${id}/coursemanagers`, options).pipe(
      map(res => res.map(cmJSON => new CourseManager(cmJSON))),
      catchError(this.handleError),);
  }

  public describe(): Observable<any> {
    return super.describe('affiliates', this.http, this.jwt);
  }

  public map(affiliate: Affiliate) {
    return this.http.post<{ mapped?: boolean }>(`${this.baseUrl}/${affiliate.sfId}/map`, affiliate, requestOptions(this.jwt)).pipe(
      map(res => {
        if (!res.mapped) {
          throw { error: 'NOT_MAPPED', status: 500 };
        }

        return res as { mapped: true };
      }),
      catchError(this.handleError),);
  }

}
