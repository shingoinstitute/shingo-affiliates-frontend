// Angular Modules
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

export interface CountryItem {
  name: string
  translations: Record<string, string>
}

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private _baseUrl =
    'https://restcountries.eu/rest/v2/all?fields=name;translations'

  constructor(private http: HttpClient) {}

  public get() {
    return this.http.get<CountryItem[]>(this._baseUrl)
  }
}
