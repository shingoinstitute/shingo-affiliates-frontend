import { catchError, map } from 'rxjs/operators'
import { Observable } from 'rxjs'
// Angular Modules
import { isDevMode } from '@angular/core'

// App Modules
import { BaseService } from './base.abstract.service'

// RxJS operators

import { pick } from 'lodash'
import { sfToCamelCase, requestOptions } from '../../util/util'
import { environment } from '../../../environments/environment'
import { JWTService } from '../auth/auth.service'
import { HttpClient } from '@angular/common/http'

export interface SFSuccessResult {
  id: string
  success: boolean
  errors: any[]
}

export abstract class BaseAPIService extends BaseService {
  protected _baseUrl = environment.apiUrl

  // Contract for all APIServices;
  public abstract getAll(): Observable<any[]>
  public abstract getById(id: string): Observable<any>
  public abstract create(obj: any): Observable<SFSuccessResult>
  public abstract update(obj: any): Observable<SFSuccessResult>
  public abstract delete(obj: any): Observable<SFSuccessResult>
  public abstract search(query: string): Observable<any[]>

  public describe(
    route: 'workshops' | 'facilitators' | 'affiliates' | 'support',
    http: HttpClient,
    jwt: JWTService,
  ) {
    return http
      .get<{ fields: any[] }>(
        `${this.APIHost()}/${route}/describe`,
        requestOptions(jwt),
      )
      .pipe(
        map(data => {
          const props: { [k: string]: any } = {}

          data.fields
            .filter(
              field =>
                field.inlineHelpText || field.label || field.picklistValues,
            )
            .map(field =>
              pick(field, [
                'inlineHelpText',
                'label',
                'name',
                'picklistValues',
              ]),
            )
            .forEach(field => (props[sfToCamelCase(field.name)] = field))

          return props
        }),
        catchError(err => this.handleError(err)),
      )
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
