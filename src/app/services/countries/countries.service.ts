import { merge as observableMerge, Observable } from 'rxjs'

import { catchError, map } from 'rxjs/operators'
// Angular Modules
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

// App Modules
import { BaseService } from '../api/base.abstract.service'

// Lodash Functions
import { without } from 'lodash'

@Injectable()
export class CountriesService extends BaseService {
  protected _baseUrl = 'https://restcountries.eu/rest/v2/region'
  protected _basePort = '80'

  constructor(public http: HttpClient) {
    super()
  }

  public get(): Observable<string[]> {
    const countryRequestsByRegion = [
      'africa',
      'americas',
      'asia',
      'europe',
      'oceania',
    ].map(region => {
      return this.http.get(`${this._baseUrl}/${region}?fields=name`)
    })

    const filterNames = [
      'United Kingdom of Great Britain and Northern Ireland',
      'United States of America',
      'United Kingdom',
      'United States',
    ]

    return observableMerge(...countryRequestsByRegion).pipe(
      map((data: any) => {
        let countryNames = data.map(value => value.name).sort()
        countryNames = without(countryNames, filterNames)
        countryNames = ['United States', 'United Kingdom'].concat(countryNames)
        return countryNames
      }),
      catchError(this.handleError),
    )
  }
}
