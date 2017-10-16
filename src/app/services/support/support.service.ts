// tslint:disable:variable-name
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

export const DEFAULT_SUPPORT_SEARCH_FIELDS: string[] = ['Id', 'Title__c', 'Category__c', 'Content__c'];

export type SupportPageCategoryType = 'Authentication' | 'Workshops' | 'Dashboard' | 'Affiliates' | 'Facilitators' | 'Other' | undefined;

export class SupportPage {
  // public title: string;
  // public content: string;
  // public category: string;

  public Category__c: string;
  public Content__c: string;
  public Title__c: string;
  public Category_Icon__c: string;

  public get title(): string { return this.Title__c; }
  public get content(): string { return this.Content__c; }
  public get category(): string { return this.Category__c; }
  public get categoryIcon(): string { return this.Category_Icon__c; }
  
  public static get SupportPageCategoryTypes(): SupportPageCategoryType[] { return ['Authentication', 'Workshops', 'Dashboard', 'Affiliates', 'Facilitators', 'Other']; }

  constructor(supportPage?: any) {
    if (supportPage) Object.assign(this, supportPage);
  }
}

// tslint:disable-next-line:max-classes-per-file
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
    let headers = new HttpHeaders().set('x-jwt', this.http.jwt);
    headers = headers.set('x-search', query);
    headers = headers.set('x-retrieve', fields.join());

    return this.http.get(this.baseUrl + '/search', { headers, withCredentials: true })
      .map(res => res.map(spJSON => new SupportPage(spJSON)))
      .catch(this.handleError);
  }

}