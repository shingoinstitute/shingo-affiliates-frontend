import { ApiBase } from '~app/shared/services/api/api-base.abstract'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { WorkshopsController } from '@shingo/affiliates-api/controllers'
import { ApiContract } from '~app/util/api-contract'
import { Observable } from 'rxjs'

export const DEFAULT_WORKSHOP_SEARCH_FIELDS: string[] = [
  'Id',
  'Start_Date__c',
  'End_Date__c',
  'Status__c',
  'Workshop_Type__c',
  'Organizing_Affiliate__c',
]

/** The base type resulting from a call to WorkshopService.getById */
export type ReadReturn = Exclude<
  WorkshopContract['read']['returntype'],
  undefined
>
/** The base type resulting from a call to WorkshopService.getAll */
export type ReadAllReturn = WorkshopContract['readAll']['returntype'][number]

export type WorkshopContract = ApiContract<WorkshopsController>

@Injectable({
  providedIn: 'root',
})
export class WorkshopService extends ApiBase {
  constructor(http: HttpClient) {
    super(http)
  }

  getAll() {
    type Base = WorkshopContract['readAll']
    return this.request<Base>('/workshops', 'GET')
  }

  getById(id: string) {
    type Base = WorkshopContract['read']
    return this.request<Base>('/workshops/:id', 'GET', { urlparams: { id } })
  }

  create(body: WorkshopContract['create']['body']) {
    type Base = WorkshopContract['create']
    return this.request<Base>('/workshops', 'POST', { body })
  }

  update(body: WorkshopContract['update']['body']) {
    type Base = WorkshopContract['update']
    return this.request<Base>('/workshops/:id', 'PUT', {
      urlparams: { id: body.Id },
      body,
    })
  }

  delete(id: string) {
    type Base = WorkshopContract['delete']
    return this.request<Base>('/workshops/:id', 'DELETE', {
      urlparams: { id },
    })
  }

  search(query: string, fields: string[] = DEFAULT_WORKSHOP_SEARCH_FIELDS) {
    type Base = WorkshopContract['search']

    return this.request<Base>('/workshops/search', 'GET', {
      params: {
        '0': { info: { kind: 'query', key: 'search' }, data: query },
        '1': { info: { kind: 'query', key: 'retrieve' }, data: fields },
      },
    })
  }

  describe() {
    type Base = WorkshopContract['describe']
    return this.request<Base>('/workshops/describe', 'GET', { params: {} })
  }

  uploadAttendeeFile(id: string, file: File, progress: true): Observable<any>
  uploadAttendeeFile(
    id: string,
    file: File,
    progress?: false,
  ): Observable<WorkshopContract['uploadAttendeeFile']['returntype']>
  uploadAttendeeFile(
    id: string,
    file: File,
    progress = false,
  ): Observable<any> {
    type Base = WorkshopContract['uploadAttendeeFile']

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
  ): Observable<WorkshopContract['uploadEvaluations']['returntype']>
  uploadEvaluations(
    id: string,
    files: File[],
    progress = false,
  ): Observable<any> {
    type Base = WorkshopContract['uploadEvaluations']
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
    type Base = WorkshopContract['cancel']
    return this.request<Base>('/workshops/:id/cancel', 'PUT', {
      urlparams: { id },
      body: { reason },
    })
  }
}
