import { Http, RequestOptionsArgs } from '@angular/http';

import { Observable } from 'rxjs';

export class MockHttp extends Http {
  
  constructor() {
    super(null, null);
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<any> {
    return Observable.of(true).delay(10);
  }
  
  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return Observable.of(true).delay(10);
  }
  
  public put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return Observable.of(true).delay(10);
  }
  
  public delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    return Observable.of(true).delay(10);
  }
  
  public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return Observable.of(true).delay(10);
  }
  
  public head(url: string, options?: RequestOptionsArgs): Observable<any> {
    return Observable.of(true).delay(10);
  }

  public options(url: string, options?: RequestOptionsArgs): Observable<any> {
    return Observable.of(true).delay(10);
  }

}