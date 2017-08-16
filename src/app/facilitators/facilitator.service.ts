import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { BaseAPIService, SFSuccessResult } from '../shared/providers/base-api.abstract.service';
import { HttpService, RequestOptionsArgs, Headers } from '../shared/providers/http.service';
import { Facilitator } from './Facilitator';

/* RxJS operators */
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export const DEFAULT_FACILITATOR_SEARCH_FIELDS: string[] = ['Id', 'FirstName', 'LastName', 'Name', 'Email', 'AccountId'];

@Injectable()
export class FacilitatorService extends BaseAPIService {

  private route: string = 'facilitators';
  private get baseUrl() { return `${this.APIHost()}/${this.route}`; }

  constructor(private http: HttpService) { super(); }

  public getAll(): Observable<Facilitator[]> {
    throw new Error("Method not implemented.");
  }

  public getById(id: string): Observable<Facilitator> {
    throw new Error("Method not implemented.");
  }

  public create(obj: Facilitator): Observable<SFSuccessResult> {
    throw new Error("Method not implemented.");
  }

  public update(obj: Facilitator): Observable<SFSuccessResult> {
    throw new Error("Method not implemented.");
  }

  public delete(obj: Facilitator): Observable<SFSuccessResult> {
    throw new Error("Method not implemented.");
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

}
