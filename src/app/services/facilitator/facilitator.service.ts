// Angular Modules
import { Injectable } from '@angular/core';
import { RequestOptionsArgs, Headers } from '@angular/http'

// App Modules
import { HttpService } from '../http/http.service';
import { BaseAPIService, SFSuccessResult } from '../base-api.abstract.service';
import { Facilitator } from '../../facilitators/Facilitator';

// RxJS Modules
import { Observable } from "rxjs/Observable";

// RxJS operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export const DEFAULT_FACILITATOR_SEARCH_FIELDS: string[] = ['Id', 'FirstName', 'LastName', 'Name', 'Email', 'AccountId'];

@Injectable()
export class FacilitatorService extends BaseAPIService {

  private route: string = 'facilitators';
  private get baseUrl() { return `${this.APIHost()}/${this.route}`; }

  constructor(private http: HttpService) { super(); }

  public getAll(): Observable<Facilitator[]> {
    return this.http.get(this.baseUrl)
      .map(res => res.json().map(facJSON => new Facilitator(facJSON)))
      .catch(this.handleError);
  }

  public getById(id: string): Observable<Facilitator> {
    return this.http.get(`${this.baseUrl}/${id}`)
      .map(res => new Facilitator(res.json()))
      .catch(this.handleError);
  }

  public create(obj: Facilitator): Observable<SFSuccessResult> {
    return this.http.post(`${this.baseUrl}`, obj)
      .map(res => res.json())
      .catch(this.handleError);
  }

  public update(obj: Facilitator): Observable<SFSuccessResult> {
    return this.http.put(`${this.baseUrl}/${obj.sfId}`, obj)
      .map(res => res.json())
      .catch(this.handleError);
  }

  public delete(obj: Facilitator): Observable<SFSuccessResult> {
    return this.http.delete(`${this.baseUrl}/${obj.sfId}`)
      .map(res => res.json())
      .catch(this.handleError);
  }

  public search(query: string, fields: string[] = DEFAULT_FACILITATOR_SEARCH_FIELDS): Observable<Facilitator[]> {
    // Set headers (NOTE: Must include token here)
    const headers = new Headers();
    headers.set('x-jwt', this.http.jwt);
    headers.set('x-search', query);
    headers.set('x-retrieve', fields.join());

    return this.http.get(this.baseUrl + '/search', { headers, withCredentials: true } as RequestOptionsArgs)
      .map(res => res.json().map(facJSON => new Facilitator(facJSON)))
      .catch(this.handleError);
  }

  public describe(): Observable<Facilitator> {
    return super.describe('facilitators', this.http);
  }

  /**
   * @todo Implement me please
   * @description Sends a reset password email to facilitator (or something like that...)
   */
  public resetPassword(obj: Facilitator): Observable<SFSuccessResult> {
    return Observable.throw('Method not implemented!');
  }

  /**
   * @todo Implement me too!
   * @description Removes service from a facilitator
   */
  public disable(obj: Facilitator): Observable<SFSuccessResult> {
    return Observable.throw('Method not implemented!');
  }

}
