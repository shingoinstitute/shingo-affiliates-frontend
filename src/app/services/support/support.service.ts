// tslint:disable:variable-name
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest } from '@angular/common/http';

// App Modules
import { APIHttpService } from '../http/http.service';
import { BaseAPIService, ISFSuccessResult } from '../api/base-api.abstract.service';
import { SupportPage } from './support.model';

// RxJS Modules
import { Observable } from 'rxjs';

// RxJS operators






export const DEFAULT_SUPPORT_SEARCH_FIELDS: string[] = ['Id', 'Title__c', 'Category__c', 'Content__c'];

@Injectable()
export class SupportService extends BaseAPIService {

  public get baseUrl() { return `${this.APIHost()}/${this.route}`; }

  public route = 'support';

  constructor(public http: APIHttpService) { super(); }

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
    return super.describe('support', this.http);
  }

  public search(query: string, fields: string[] = DEFAULT_SUPPORT_SEARCH_FIELDS) {
    // Set headers (NOTE: Must include token here if it exists)
    let headers = new HttpHeaders().set('x-search', query);
    headers = headers.set('x-retrieve', fields.join());
    if (this.http.jwt !== null) headers = headers.set('x-jwt', this.http.jwt);
    return this.http.get<any[]>(this.baseUrl + '/search', { headers, withCredentials: true })
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
