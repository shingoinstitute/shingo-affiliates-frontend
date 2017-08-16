import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { BaseAPIService, SFSuccessResult } from '../shared/providers/base-api.abstract.service';
import { HttpService, RequestOptionsArgs, Headers } from '../shared/providers/http.service';
import { CourseManager } from '../shared/CourseManager';
import { Affiliate } from './Affiliate';

@Injectable()
export class AffiliateService extends BaseAPIService {

  private route: string = 'facilitators';
  private get baseUrl() { return `${this.APIHost()}/${this.route}`; }

  constructor(private http: HttpService) { super(); }

  public getAll(): Observable<Affiliate[]> {
    throw new Error("Method not implemented.");
  }

  public getById(id: string): Observable<Affiliate> {
    throw new Error("Method not implemented.");
  }

  public create(obj: Affiliate): Observable<SFSuccessResult> {
    throw new Error("Method not implemented.");
  }

  public update(obj: Affiliate): Observable<SFSuccessResult> {
    throw new Error("Method not implemented.");
  }

  public delete(obj: Affiliate): Observable<SFSuccessResult> {
    throw new Error("Method not implemented.");
  }

  public search(query: string): Observable<Affiliate[]> {
    throw new Error("Method not implemented.");
  }

  public searchCMS(query: string): Observable<CourseManager[]> {
    // Set headers (NOTE: Must include token here)
    const headers = new Headers();
    headers.set('x-jwt', this.http.jwt);
    headers.set('x-search', query);
    headers.set('x-retrieve', ['Id', 'Name', 'Email']);

    return this.http.get(this.baseUrl + '/search', { headers, withCredentials: true } as RequestOptionsArgs)
      .map(res => res.json().map(cmJSON => new CourseManager(cmJSON)))
      .catch(this.handleError);
  }

  public describe(): Observable<any> {
    return super.describe('affiliates', this.http);
  }

}
