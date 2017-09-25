// Angular Modules
import { isDevMode } from '@angular/core';

// App Modules
import { HttpService } from '../http/http.service';
import { BaseService } from './base.abstract.service';

// RxJS Modules
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

// RxJS operators
import 'rxjs/add/observable/throw';

import { pick } from 'lodash';

export interface ISFSuccessResult {
  id: string;
  success: boolean;
  errors: any[];
}

export abstract class BaseAPIService extends BaseService {

  protected _baseUrl: string = (isDevMode() ? 'http://129.123.47.34' : 'https://api.shingo.org/v2/affiliates');
  protected _basePort: string = (isDevMode() ? '8080' : '');

  // Contract for all APIServices;
  public abstract getAll(): Observable<any[]>;
  public abstract getById(id: string): Observable<any>;
  public abstract create(obj: any): Observable<ISFSuccessResult>;
  public abstract update(obj: any): Observable<ISFSuccessResult>;
  public abstract delete(obj: any): Observable<ISFSuccessResult>;
  public abstract search(query: string): Observable<any[]>;

  public describe(route: 'workshops' | 'facilitators' | 'affiliates', http: HttpService): Observable<any> {
    return http.get(`${this.APIHost()}/${route}/describe`)
      .map(data => {
        const props = {};

        data.fields.filter(field => field.inlineHelpText || field.label || field.picklistValues)
          .map(field => pick(field, ['inlineHelpText', 'label', 'name', 'picklistValues']))
          .forEach(field => props[this.toCamelCase(field.name)] = field);

        return props;
      })
      .catch(this.handleError);
  }

  public sfObjectFactory<T>(type: { new(...args: any[]): T; }, ...args: any[]): T {
    return new type(args);
  }

  protected APIHost() { return `${this._baseUrl}${this._basePort ? ':' + this._basePort : ''}`; }
}