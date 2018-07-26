import { HttpService } from './http.service';
import { Observable } from 'rxjs';

// TODO: Move MockHttpService to http folder
// TODO: Override other functions
// Extend the HttpService so that it can be
// injected into classes that depend on it.
// NOTE: The mocked interface needs to match
// the mockees interface
export class HttpServiceMock extends HttpService {

  private _jwt: string = null;
  public get jwt(): string { return  'some jwt token'; }
  public set jwt(value: string) { this._jwt = value; }

  constructor(private mockObj: any) { super(null, null); }

  // As get is used to get arrays of and single 
  // instances of Affiliates, return the right one
  public get<T>(url: string, options: any): Observable<any> {
    if (url.includes('some sf id')) return Observable.of(this.mockObj[0]);
    return Observable.of(this.mockObj);
  }

  // Post always returns an SFSuccessResponse for Affiliates
  public post<T>(url: string, body: any): Observable<any> {
    if (url.includes('some sf id')) return Observable.of(this.mockObj[0]);
    return Observable.of(this.mockObj);
  }

  public put<T>(url: string, body: any): Observable<any> {
    if (url.includes('some sf id')) return Observable.of(this.mockObj[0]);
    return Observable.of(this.mockObj);
  }
  
  public delete<T>(url: string): Observable<any> {
    if (url.includes('some sf id')) return Observable.of(this.mockObj[0]);
    return Observable.of(this.mockObj);
  }

  public removeToken() {
    this.jwt = null;
  }

}