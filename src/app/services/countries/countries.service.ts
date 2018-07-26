// Angular Modules
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


// App Modules
import { BaseService } from '../api/base.abstract.service';

// RxJS Modules
import { Observable } from 'rxjs';

// Lodash Functions
import { without } from 'lodash';

@Injectable()
export class CountriesService extends BaseService {

  protected _baseUrl: string = 'https://restcountries.eu/rest/v2/region';
  protected _basePort: string = '80';

  constructor(public http: HttpClient) { super(); }

  public get(): Observable<string[]> {
    const countryRequestsByRegion = ['africa', 'americas', 'asia', 'europe', 'oceania'].map(region => {
      return this.http.get(`${this._baseUrl}/${region}?fields=name`);
    });

    const filterNames = ['United Kingdom of Great Britain and Northern Ireland', 'United States of America', 'United Kingdom', 'United States'];
    return Observable.merge(...countryRequestsByRegion)
      .map((data: any) => {
        let countryNames = data.map(value => value.name).sort();
        countryNames = without(countryNames, filterNames);
        countryNames = ['United States', 'United Kingdom'].concat(countryNames);
        return countryNames;
      })
      .catch(this.handleError);
  }

}