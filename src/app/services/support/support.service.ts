// tslint:disable:variable-name
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest } from '@angular/common/http';

// App Modules
import { HttpService } from '../http/http.service';
import { BaseAPIService, ISFSuccessResult } from '../api/base-api.abstract.service';
import { SupportPage } from './support.model';

// RxJS Modules
import { Observable } from 'rxjs/Observable';

// RxJS operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/take';

export const DEFAULT_SUPPORT_SEARCH_FIELDS: string[] = ['Id', 'Title__c', 'Category__c', 'Content__c'];

@Injectable()
export class SupportService extends BaseAPIService {

  public get baseUrl() { return `${this.APIHost()}/${this.route}`; }

  public route: string = 'support';

  constructor(public http: HttpService) { super(); }

  public getAll(): Observable<SupportPage[]> {
    return this.http.get(this.baseUrl)
      .map(res => res.map(spJSON => new SupportPage(spJSON)))
      .catch(this.handleError);
  }

  public getById(id: string): Observable<SupportPage> {
    return this.http.get(this.baseUrl + `/${id}`)
      .map(res => new SupportPage(res))
      .catch(this.handleError);
  }

  public getCategory(name: string): Observable<SupportPage[]> {
    return this.http.get(this.baseUrl + `/category/${name}`)
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

  public describe(): Observable<any> {
    return super.describe('support', this.http);
  }

  public search(query: string, fields: string[] = DEFAULT_SUPPORT_SEARCH_FIELDS): Observable<any[]> {
    // Set headers (NOTE: Must include token here)
    let headers = new HttpHeaders().set('x-search', query);
    headers = headers.set('x-retrieve', fields.join());
    if (this.http.jwt !== '') headers = headers.set('x-jwt', this.http.jwt);
    return this.http.get(this.baseUrl + '/search', { headers, withCredentials: this.http.jwt !== '' })
      .map(res => res.map(spJSON => new SupportPage(spJSON)))
      .catch(this.handleError);
  }

}