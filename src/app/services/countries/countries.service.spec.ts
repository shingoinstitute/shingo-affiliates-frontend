import { CountriesService } from './countries.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';

class HttpMock extends HttpClient {
  constructor() {
    super(null);
  }

  public get(url: string) {
    return Observable.from([]).delay(10);
  }

}

describe('CountriesService', () => {

  let service: CountriesService;

  beforeEach(() => {
    service = new CountriesService(new HttpMock());
  });

  it('expects an array of countries', () => {
    service.get().subscribe(data => {
      expect(data).toBeDefined();
    });
  });

});