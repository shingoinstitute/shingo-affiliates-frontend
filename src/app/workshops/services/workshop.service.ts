import { ApiBase } from '~app/shared/services/api/api-base.abstract'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { WorkshopsController } from '@shingo/affiliates-api/controllers'
import { ApiContract } from '~app/util/api-contract'
import { Observable, Subject, ReplaySubject } from 'rxjs'
import { take } from 'rxjs/operators'
// tslint:disable-next-line: no-implicit-dependencies
import { DescribeSObjectResult } from 'jsforce'

export const DEFAULT_WORKSHOP_SEARCH_FIELDS: string[] = [
  'Id',
  'Start_Date__c',
  'End_Date__c',
  'Status__c',
  'Workshop_Type__c',
  'Organizing_Affiliate__c',
]

/** The base type resulting from a call to WorkshopService.getById */
export type ReadReturn = Exclude<Contract['read']['returntype'], undefined>
/** The base type resulting from a call to WorkshopService.getAll */
export type ReadAllReturn = Contract['readAll']['returntype'][number]

export type Contract = ApiContract<WorkshopsController>

// it's unlikely describe results will change over a users session,
// and they take a long time to fetch. We can cache them using a subject
// it doesn't make much sense to put in the store, since our usage of them
// is pretty simple (we only get and run a transformation function over)
const describeCache: Subject<DescribeSObjectResult> = new ReplaySubject(1)

@Injectable({
  providedIn: 'root',
})
export class WorkshopService extends ApiBase {
  constructor(http: HttpClient) {
    super(http)
  }

  getAll() {
    type Base = Contract['readAll']
    return this.request<Base>('/workshops', 'GET')
  }

  getById(id: string) {
    type Base = Contract['read']
    return this.request<Base>('/workshops/:id', 'GET', { urlparams: { id } })
  }

  create(body: Contract['create']['body']) {
    type Base = Contract['create']
    return this.request<Base>('/workshops', 'POST', { body })
  }

  update(body: Contract['update']['body']) {
    type Base = Contract['update']
    return this.request<Base>('/workshops/:id', 'PUT', {
      urlparams: { id: body.Id },
      body,
    })
  }

  delete(id: string) {
    type Base = Contract['delete']
    return this.request<Base>('/workshops/:id', 'DELETE', {
      urlparams: { id },
    })
  }

  search(query: string, fields: string[] = DEFAULT_WORKSHOP_SEARCH_FIELDS) {
    type Base = Contract['search']

    return this.request<Base>('/workshops/search', 'GET', {
      params: {
        '0': { info: { kind: 'query', key: 'search' }, data: query },
        '1': { info: { kind: 'query', key: 'retrieve' }, data: fields },
      },
    })
  }

  describe() {
    type Base = Contract['describe']
    return this.request<Base>('/workshops/describe', 'GET', { params: {} })
  }

  describeCached() {
    // we make the request and store a result when we get it in the cache
    const req = this.describe().pipe(take(1))
    req.subscribe(v => describeCache.next(v))

    // the cache will return the last value immediately, but any subscribers
    // should get updated when the network request completes
    return describeCache.asObservable()
  }

  uploadAttendeeFile(id: string, file: File, progress: true): Observable<any>
  uploadAttendeeFile(
    id: string,
    file: File,
    progress?: false,
  ): Observable<Contract['uploadAttendeeFile']['returntype']>
  uploadAttendeeFile(
    id: string,
    file: File,
    progress = false,
  ): Observable<any> {
    type Base = Contract['uploadAttendeeFile']

    const options = this.request<Base>(
      '/workshops/:id/attendee_file',
      'POST',
      {
        urlparams: { id },
        files: { attendeeList: [file] },
      },
      true,
    )

    return this.http.request(options.method, options.url, {
      ...options.options,
      reportProgress: progress,
    })
  }

  uploadEvaluations(id: string, files: File[], progress: true): Observable<any>
  uploadEvaluations(
    id: string,
    files: File[],
    progress?: false,
  ): Observable<Contract['uploadEvaluations']['returntype']>
  uploadEvaluations(
    id: string,
    files: File[],
    progress = false,
  ): Observable<any> {
    type Base = Contract['uploadEvaluations']
    const options = this.request<Base>(
      '/workshops/:id/evaluation_files',
      'POST',
      {
        urlparams: { id },
        files: { evaluationFiles: files },
      },
      true,
    )

    return this.http.request(options.method, options.url, {
      ...options.options,
      reportProgress: progress,
    })
  }

  cancel(id: string, reason: string) {
    type Base = Contract['cancel']
    return this.request<Base>('/workshops/:id/cancel', 'PUT', {
      urlparams: { id },
      body: { reason },
    })
  }
}
