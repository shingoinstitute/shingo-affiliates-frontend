import { catchError, map } from 'rxjs/operators'
import { Observable } from 'rxjs'
// Angular Modules
import { Injectable, EventEmitter } from '@angular/core'
import { HttpHeaders, HttpClient } from '@angular/common/http'
import { RequestOptionsArgs, Headers } from '@angular/http'

// App Modules
import {
  BaseAPIService,
  SFSuccessResult,
} from '../api/base-api.abstract.service'
import { Facilitator } from '../../facilitators/facilitator.model'

import { JWTService } from '../auth/auth.service'
import { requestOptions } from '../../util/util'
import { tuple } from '../../util/functional'

export const DEFAULT_FACILITATOR_SEARCH_FIELDS: string[] = [
  'Id',
  'FirstName',
  'LastName',
  'Name',
  'Email',
  'AccountId',
  'Title',
  'Photograph__c',
]

@Injectable()
export class FacilitatorService extends BaseAPIService {
  public reloadData$ = new EventEmitter<void>()

  public route = 'facilitators'
  public get baseUrl() {
    return `${this.APIHost()}/${this.route}`
  }

  constructor(public http: HttpClient, public jwt: JWTService) {
    super()
  }

  public getAll() {
    return this.http.get<any[]>(this.baseUrl, requestOptions(this.jwt)).pipe(
      map(res => res.map(facJSON => new Facilitator(facJSON))),
      catchError(err => this.handleError(err)),
    )
  }

  public getById(id: string) {
    return this.http
      .get(`${this.baseUrl}/${id}`, requestOptions(this.jwt))
      .pipe(
        map(res => new Facilitator(res)),
        catchError(err => this.handleError(err)),
      )
  }

  public create(obj: Facilitator) {
    const { __name, ...rest } = JSON.parse(JSON.stringify(obj))
    return this.http
      .post<SFSuccessResult>(`${this.baseUrl}`, rest, requestOptions(this.jwt))
      .pipe(
        map(res => res),
        catchError(err => this.handleError(err)),
      )
  }

  public map(obj: Facilitator) {
    const { __name, ...rest } = JSON.parse(JSON.stringify(obj))
    return this.http
      .post<SFSuccessResult>(
        `${this.baseUrl}/${obj.sfId}`,
        rest,
        requestOptions(this.jwt),
      )
      .pipe(
        map(res => res),
        catchError(err => this.handleError(err)),
      )
  }

  public update(obj: Facilitator) {
    const { __name, ...rest } = JSON.parse(JSON.stringify(obj))
    return this.http
      .put<SFSuccessResult>(
        `${this.baseUrl}/${obj.sfId}`,
        rest,
        requestOptions(this.jwt),
      )
      .pipe(
        map(res => res),
        catchError(err => this.handleError(err)),
      )
  }

  public delete(obj: Facilitator) {
    return this.http
      .delete<SFSuccessResult>(
        `${this.baseUrl}/${obj.sfId}`,
        requestOptions(this.jwt),
      )
      .pipe(
        map(res => res),
        catchError(err => this.handleError(err)),
      )
  }

  /**
   * @description Removes service from a facilitator
   */
  public disable(obj: Facilitator) {
    return this.http
      .delete<SFSuccessResult>(
        `${this.baseUrl}/${obj.sfId}/unmap`,
        requestOptions(this.jwt),
      )
      .pipe(
        map(res => res),
        catchError(err => this.handleError(err)),
      )
  }

  /**
   * @description returns a stream of sf Contact objects
   * @param query {string} - the query string
   * @param isMapped {boolean} - returns unmapped facilitators when true, and maped facilitators when false
   */
  public search(
    query: string,
    fields: string[] = DEFAULT_FACILITATOR_SEARCH_FIELDS,
    isMapped: boolean = true,
  ) {
    const headers = [tuple('x-search', query), tuple('x-retrieve', fields)]

    if (!isMapped) headers.push(tuple('x-is-mapped', 'false'))

    return this.http
      .get<any[]>(
        this.baseUrl + '/search',
        requestOptions(this.jwt, ...headers),
      )
      .pipe(
        map(res => res.map(facJSON => new Facilitator(facJSON))),
        catchError(err => this.handleError(err)),
      )
  }

  public describe(): Observable<Facilitator> {
    return super.describe('facilitators', this.http, this.jwt)
  }

  /**
   * @todo Implement me please
   * @description Sends a reset password email to facilitator (or something like that...)
   */
  public resetPassword(email: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/resetpassword/${email}`, requestOptions(this.jwt))
      .pipe(
        map(res => res),
        catchError(err => this.handleError(err)),
      )
  }

  public changePassword(token: string, password) {
    return this.http
      .post(
        `${this.baseUrl}/resetpassword/token`,
        { token, password },
        requestOptions(this.jwt),
      )
      .pipe(
        map(res => new Facilitator(res)),
        catchError(err => this.handleError(err)),
      )
  }
}
