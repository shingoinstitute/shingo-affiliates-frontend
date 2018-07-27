// tslint:disable:variable-name
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest, HttpClient } from '@angular/common/http';

// App Modules
import { BaseAPIService, ISFSuccessResult } from '../api/base-api.abstract.service';
import { SupportPage } from './support.model';

// RxJS Modules
import { Observable } from 'rxjs';
import { JWTService } from '../auth/auth.service';
import { requestOptions } from '../../util/util';
import { tuple } from '../../util/functional';

// RxJS operators






export const DEFAULT_SUPPORT_SEARCH_FIELDS: string[] = ['Id', 'Title__c', 'Category__c', 'Content__c'];

@Injectable()
export class SupportService extends BaseAPIService {

  public get baseUrl() { return `${this.APIHost()}/${this.route}`; }

  public route = 'support';

  constructor(public http: HttpClient, public jwt: JWTService) { super(); }

  public getAll() {
    return this.http.get<any[]>(this.baseUrl)
      .map(res => res.map(spJSON => new SupportPage(spJSON)))
      .catch(this.handleError);
  }

  public getById(id: string) {
    return this.http.get<any>(this.baseUrl + `/${id}`)
      .map(res => new SupportPage(res))
      .catch(this.handleError);
  }

  public getCategory(name: string) {
    return this.http.get<any[]>(this.baseUrl + `/category/${name}`)
      .map(res => res.map(spJSON => new SupportPage(spJSON)))
      .catch(this.handleError);
  }

  public create(obj: any): Observable<ISFSuccessResult> {
    throw new Error('Method not implemented.');
  }

  public update(obj: any): Observable<ISFSuccessResult> {
    throw new Error('Method not implemented.');
  }

  public delete(obj: any): Observable<ISFSuccessResult> {
    throw new Error('Method not implemented.');
  }

  public describe() {
    return super.describe('support', this.http, this.jwt);
  }

  public search(query: string, fields: string[] = DEFAULT_SUPPORT_SEARCH_FIELDS) {
    const options = requestOptions(this.jwt,
      tuple('x-search', query),
      tuple('x-retrieve', fields),
    );

    return this.http.get<any[]>(this.baseUrl + '/search', options)
      .map(res => res.map(spJSON => new SupportPage(spJSON)))
      .catch(this.handleError);
  }

  public getCategories(): Observable<any> {
    return this.describe()
      .map(desc => {
        const categories: string[] = [];
        if (desc && desc.category && desc.category.picklistValues) {
          for (const value of desc.category.picklistValues) {
            if (value.active && value.label) {
              categories.push(value.label);
            }
          }
          return categories.sort();
        }
        return categories;
      })
      .catch(this.handleError);
  }

}
