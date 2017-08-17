import { Injectable } from '@angular/core';
import { HttpService, RequestOptionsArgs, Headers } from '../shared/providers/http.service';
import { Observable } from 'rxjs/Observable';
import { BaseAPIService, SFSuccessResult } from '../shared/providers/base-api.abstract.service';
import { Workshop } from './Workshop';

/* RxJS operators */
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export { SFSuccessResult, Workshop }
export const DEFAULT_WORKSHOP_SEARCH_FIELDS: string[] = ['Id', 'Start_Date__c', 'End_Date__c', 'Status__c', 'Workshop_Type__c', 'Organizing_Affilaite__c'];

@Injectable()
export class WorkshopService extends BaseAPIService {

  private route: string = 'workshops';
  private get baseUrl() { return `${this.APIHost()}/${this.route}`; }

  constructor(private http: HttpService) { super(); }

  public getAll(): Observable<Workshop[]> {
    return this.http.get(this.baseUrl)
      .map(res => res.json.map(wkJSON => new Workshop(wkJSON)))
      .catch(this.handleError);
  }

  public getById(id: string): Observable<Workshop> {
    return this.http.get(this.baseUrl + `/${id}`)
      .map(res => {console.log(res.json()); return new Workshop(res.json()[0])})
      .catch(this.handleError);
  }

  public create(obj: Workshop): Observable<SFSuccessResult> {
    return this.http.post(this.baseUrl, obj.toSFJSON())
      .map(res => res.json() as SFSuccessResult)
      .catch(this.handleError);
  }

  public update(obj: Workshop): Observable<SFSuccessResult> {
    return this.http.put(this.baseUrl + `/${obj.sfId}`, obj.toSFJSON())
      .map(res => res.json() as SFSuccessResult)
      .catch(this.handleError);
  }

  public delete(obj: Workshop): Observable<SFSuccessResult> {
    return this.http.delete(this.baseUrl + `/${obj.sfId}`)
      .map(res => res.json() as SFSuccessResult)
      .catch(this.handleError);
  }

  public search(query: string, fields: string[] = DEFAULT_WORKSHOP_SEARCH_FIELDS): Observable<Workshop[]> {
    // Set headers (NOTE: Must include token here)
    const headers = new Headers();
    headers.set('x-jwt', this.http.jwt);
    headers.set('x-search', query);
    headers.set('x-retrieve', fields.join());

    return this.http.get(this.baseUrl + '/search', { headers, withCredentials: true } as RequestOptionsArgs)
      .map(res => res.json().map(wkJSON => new Workshop(wkJSON)))
      .catch(this.handleError);
  }

  public describe(): Observable<any> {
    return super.describe('workshops', this.http);
  }

}
