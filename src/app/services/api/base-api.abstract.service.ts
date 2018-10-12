// Angular Modules
import { isDevMode } from '@angular/core'

// App Modules
import { BaseService } from './base.abstract.service'

// RxJS Modules
import { Observable } from 'rxjs/Observable'

// RxJS operators

import { pick } from 'lodash'
import { sfToCamelCase, requestOptions } from '../../util/util'
import { environment } from '../../../environments/environment'
import { JWTService } from '../auth/auth.service'
import { HttpClient } from '@angular/common/http'
import { map, catchError } from 'rxjs/operators'
import { pipe } from 'rxjs/util/pipe'

export interface ISFSuccessResult {
  id: string
  success: boolean
  errors: any[]
}

export abstract class BaseAPIService extends BaseService {
  protected _baseUrl = environment.apiUrl

  // Contract for all APIServices;
  public abstract getAll<T>(): Observable<T[]>
  public abstract getById(id: string): Observable<any>
  public abstract create(obj: any): Observable<ISFSuccessResult>
  public abstract update(obj: any): Observable<ISFSuccessResult>
  public abstract delete(obj: any): Observable<ISFSuccessResult>
  public abstract search(query: string): Observable<any[]>

  public describe(
    route: 'workshops' | 'facilitators' | 'affiliates' | 'support',
    http: HttpClient,
    jwt: JWTService,
  ) {
      catchError(err => this.handleError(err)),
    )(http.get<any>(`${this.APIHost()}/${route}/describe`, requestOptions(jwt)))
  }

  public sfObjectFactory<T>(
    type: { new (...args: any[]): T },
    ...args: any[]
  ): T {
    return new type(args)
  }

  protected APIHost() {
    return this._baseUrl
  }
}
