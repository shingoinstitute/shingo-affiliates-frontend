import { when, mock, instance, anyOfClass, anyString, anything } from 'ts-mockito';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/observable/of';
import { HttpService } from './http.service';
import { Observable } from 'rxjs/Observable';
import { E2BIG } from 'constants';

// TODO: Move MockHttpService to http folder
// TODO: Override other functions
// Extend the HttpService so that it can be
// injected into classes that depend on it.
// NOTE: The mocked interface needs to match
// the mockees interface
export class HttpServiceMock {

  private mockInstance: HttpService;

  public get mock(): HttpService { return this.mockInstance; }

  public constructor(expectedData: any) {
    this.init(expectedData);
  }

  public init(expectedData: any) {
    this.mockInstance = mock(HttpService);


    when(this.mockInstance.get(anyString())).thenReturn(Observable.of(expectedData));
    when(this.mockInstance.get(anyString(), anything())).thenReturn(Observable.of(expectedData));
    when(this.mockInstance.post(anyString(), anything())).thenReturn(Observable.of(expectedData));
    when(this.mockInstance.post(anyString(), anything(), anything())).thenReturn(Observable.of(expectedData));
    when(this.mockInstance.put(anyString(), anything())).thenReturn(Observable.of(expectedData));
    when(this.mockInstance.delete(anyString())).thenReturn(Observable.of(expectedData));
    when(this.mockInstance.request(anything())).thenReturn(Observable.of(expectedData));
    when(this.mockInstance._defaultReqOpts).thenReturn({
      headers: new HttpHeaders().set('x-jwt', '') || [],
      withCredentials: true,
      observe: 'body',
      responseType: 'json'
    });

  }

}