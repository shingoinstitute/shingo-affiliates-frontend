// Angular Modules
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'

export interface CountryItem {
  name: string
  translations: Record<string, string>
}

@Injectable()
export class CountriesService {
  private _baseUrl =
    'https://restcountries.eu/rest/v2/all?fields=name;translations'

  constructor(private http: HttpClient) {}

  public get() {
    return this.http.get<CountryItem[]>(this._baseUrl).pipe(
      map(cs =>
        cs.map(
          c =>
            // Salesforce is automatically changing United States of America to United States
            // TODO: fix salesforce instead of this hack
            c.name === 'United States of America'
              ? { ...c, name: 'United States' }
              : c,
        ),
      ),
    )
  }
}
