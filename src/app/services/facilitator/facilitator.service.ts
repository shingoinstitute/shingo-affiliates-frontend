// Angular Modules
import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
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

  public reloadData$ = new EventEmitter<void>();

  constructor(private http: HttpService) { super(); }

  public getAll(): Observable<Facilitator[]> {
    return this.http.get(this.baseUrl)
      .map(res => res.map(facJSON => new Facilitator(facJSON)))
      .catch(this.handleError);
  }

  public getById(id: string): Observable<Facilitator> {
    return this.http.get(`${this.baseUrl}/${id}`)
      .map(res => new Facilitator(res))
      .catch(this.handleError);
  }

  public create(f: Facilitator): Observable<SFSuccessResult> {
    return this.http.post(`${this.baseUrl}`, f.toSFJSON())
      .map(res => res)
      .catch(this.handleError);
  }

  public update(obj: Facilitator): Observable<SFSuccessResult> {
    return this.http.put(`${this.baseUrl}/${obj.sfId}`, obj.toSFJSON())
      .map(res => res)
      .catch(this.handleError);
  }

  public delete(obj: Facilitator): Observable<SFSuccessResult> {
    return this.http.delete(`${this.baseUrl}/${obj.sfId}`)
      .map(res => res)
      .catch(this.handleError);
  }

  /**
  * @description Removes service from a facilitator
  */
  public disable(obj: Facilitator): Observable<SFSuccessResult> {
    return this.http.delete(`${this.baseUrl}/${obj.sfId}/unmap`)
      .map(res => res)
      .catch(this.handleError);
  }

  /**
   * @description returns a stream of sf Contact objects
   * @param query {string} - the query string
   * @param filter {boolean} - filters out non-facilitator Contacts when true
   */
  public search(query: string, filter: boolean = true, fields: string[] = DEFAULT_FACILITATOR_SEARCH_FIELDS): Observable<Facilitator[]> {
    // Set headers (NOTE: Must include token here)
    let headers = new HttpHeaders().set('x-jwt', this.http.jwt);
    headers = headers.set('x-search', query);
    headers = headers.set('x-retrieve', fields.join());

    if (!filter) {
      headers = headers.set('x-filter', 'false');
    }

    return this.http.get(this.baseUrl + '/search', { headers, withCredentials: true })
      .map(res => res.map(facJSON => new Facilitator(facJSON)))
      .catch(this.handleError);
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
      .catch(this.handleError);
  }

  public changePassword(token: string, password): Observable<Facilitator> {
    return this.http.post(`${this.baseUrl}/resetpassword/token`, { token, password })
      .map(res => new Facilitator(res))
      .catch(this.handleError);
  }

}
