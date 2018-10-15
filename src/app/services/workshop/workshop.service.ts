import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
// Angular Modules
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

// App Modules
import {
  BaseAPIService,
  SFSuccessResult,
} from '../api/base-api.abstract.service'
import { Workshop } from '../../workshops/workshop.model'

// RxJS Modules
import { JWTService } from '../auth/auth.service'
import { requestOptions } from '../../util/util'
import { tuple } from '../../util/functional'

// RxJS operators

export { SFSuccessResult, Workshop }
export const DEFAULT_WORKSHOP_SEARCH_FIELDS: string[] = [
  'Id',
  'Start_Date__c',
  'End_Date__c',
  'Status__c',
  'Workshop_Type__c',
  'Organizing_Affiliate__c',
]

export type WorkshopProperties =
  | 'actionType'
  | 'workshopType'
  | 'dueDate'
  | 'instructors'
  | 'location'
  | 'verified'
  | 'startDate'
  | 'endDate'
  | 'hostCity'
  | 'hostCountry'
  | 'daysLate'
  | 'status'
  | 'edit'
  | 'actions'
  | undefined
export type WorkshopTrackByStrategy = 'id' | 'reference' | 'index'

@Injectable()
export class WorkshopService extends BaseAPIService {
  public get baseUrl() {
    return `${this.APIHost()}/${this.route}`
  }

  public route = 'workshops'

  constructor(public http: HttpClient, private jwt: JWTService) {
    super()
  }

  public getAll() {
    return this.http.get<any[]>(this.baseUrl, requestOptions(this.jwt)).pipe(
      map(res => res.map(wkJSON => new Workshop(wkJSON))),
      catchError(this.handleError),
    )
  }

  public getById(id: string) {
    return this.http
      .get(this.baseUrl + `/${id}`, requestOptions(this.jwt))
      .pipe(
        map(res => new Workshop(res)),
        catchError(this.handleError),
      )
  }

  public create(obj: Workshop) {
    return this.http
      .post<SFSuccessResult>(this.baseUrl, obj, requestOptions(this.jwt))
      .pipe(catchError(this.handleError))
  }

  public update(obj: Workshop) {
    return this.http
      .put<SFSuccessResult>(
        this.baseUrl + `/${obj.sfId}`,
        obj,
        requestOptions(this.jwt),
      )
      .pipe(catchError(this.handleError))
  }

  public delete(obj: Workshop) {
    return this.http
      .delete<SFSuccessResult>(
        this.baseUrl + `/${obj.sfId}`,
        requestOptions(this.jwt),
      )
      .pipe(catchError(this.handleError))
  }

  public search(
    query: string,
    fields: string[] = DEFAULT_WORKSHOP_SEARCH_FIELDS,
  ) {
    const options = requestOptions(
      this.jwt,
      tuple('x-search', query),
      tuple('x-retrieve', fields),
    )

    return this.http.get<any[]>(this.baseUrl + '/search', options).pipe(
      map(res => res.map(wkJSON => new Workshop(wkJSON))),
      catchError(this.handleError),
    )
  }

  public describe(): Observable<any> {
    return super.describe('workshops', this.http, this.jwt)
  }

  // FIXME: Fix stupid overly broad type
  public uploadAttendeeFile(id: string, file: File): Observable<any> {
    const options = { ...requestOptions(this.jwt), reportProgress: true }
    const formData: FormData = new FormData()
    formData.append('attendeeList', file, file.name)
    return this.http.post(
      `${this.baseUrl}/${id}/attendee_file`,
      formData,
      options,
    )
  }

  public uploadEvaluations(id: string, files: File[]): Observable<any> {
    const options = { ...requestOptions(this.jwt), reportProgress: true }
    const formData: FormData = new FormData()
    for (const file of files) {
      formData.append('evaluationFiles', file, file.name)
    }
    return this.http.post(
      `${this.baseUrl}/${id}/evaluation_files`,
      formData,
      options,
    )
  }

  public cancel(workshop: Workshop, reason: string): Observable<any> {
    return this.http
      .put(
        this.baseUrl + `/${workshop.sfId}/cancel`,
        { reason },
        requestOptions(this.jwt),
      )
      .pipe(catchError(this.handleError))
  }
}
