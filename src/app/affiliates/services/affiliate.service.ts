import { ApiContract } from '~app/util/api-contract'
import { AffiliatesController } from '@shingo/affiliates-api/controllers'
import { Injectable } from '@angular/core'
import { ApiBase } from '~app/shared/services/api/api-base.abstract'
import { Subject, ReplaySubject } from 'rxjs'
// tslint:disable-next-line: no-implicit-dependencies
import { DescribeSObjectResult } from 'jsforce'
import { take } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'

export type Contract = ApiContract<AffiliatesController>
/** The base type resulting from a call to AffiliateService.getById */
export type ReadReturn = Contract['read']['returntype']
/** The base type resulting from a call to AffiliateService.getAll */
export type ReadAllReturn = Contract['readAll']['returntype'][number]

export const DEFAULT_AFFILIATE_SEARCH_FIELDS: string[] = [
  'Id',
  'Name',
  'Languages__c',
  'Logo__c',
  'Website',
  'Summary__c',
]

const describeCache: Subject<DescribeSObjectResult> = new ReplaySubject(1)

@Injectable({ providedIn: 'root' })
export class AffiliateService extends ApiBase {
  constructor(http: HttpClient) {
    super(http)
  }

  getAll(isPublic = false) {
    type Base = Contract['readAll']
    return this.request<Base>('/affiliates', 'GET', {
      params: {
        1: { info: { kind: 'query', key: 'isPublic' }, data: isPublic },
      },
    })
  }

  getById(id: string) {
    type Base = Contract['read']
    return this.request<Base>('/affiliates/:id', 'GET', { urlparams: { id } })
  }

  create(body: Contract['create']['body']) {
    type Base = Contract['create']
    return this.request<Base>('/affiliates', 'POST', { body })
  }

  update(body: Contract['update']['body']) {
    type Base = Contract['update']
    return this.request<Base>('/affiliates/:id', 'PUT', {
      body,
      urlparams: { id: body.Id },
    })
  }

  delete(id: string) {
    type Base = Contract['delete']
    return this.request<Base>('/affiliates/:id', 'DELETE', {
      urlparams: { id },
    })
  }

  search(query: string, fields: string[] = DEFAULT_AFFILIATE_SEARCH_FIELDS) {
    type Base = Contract['search']

    return this.request<Base>('/affiliates/search', 'GET', {
      params: {
        0: { info: { kind: 'query', key: 'search' }, data: query },
        1: { info: { kind: 'query', key: 'retrieve' }, data: fields },
      },
    })
  }

  searchCMS(query: string, id: string) {
    type Base = Contract['searchCMS']
    return this.request<Base>('/affiliates/:id/coursemanagers', 'GET', {
      urlparams: { id },
      params: {
        1: { info: { kind: 'query', key: 'search' }, data: query },
        2: {
          info: { kind: 'query', key: 'retrieve' },
          data: ['Id', 'Name', 'Email'],
        },
      },
    })
  }

  describe() {
    type Base = Contract['describe']
    return this.request<Base>('/affiliates/describe', 'GET', {
      params: {},
    })
  }

  describeCached() {
    // we make the request and store a result when we get it in the cache
    const req = this.describe().pipe(take(1))
    req.subscribe(v => describeCache.next(v))

    // the cache will return the last value immediately, but any subscribers
    // should get updated when the network request completes
    return describeCache.asObservable()
  }

  map(body: Contract['map']['body']) {
    type Base = Contract['map']
    return this.request<Base>('/affiliates/:id/map', 'POST', {
      urlparams: { id: body.Id },
      body,
    })
  }
}
