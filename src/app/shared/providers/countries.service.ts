import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { BaseService } from './base.abstract.service';

@Injectable()
export class CountriesService extends BaseService {

    protected BaseUrl: string = 'https://restcountries.eu/rest/v2/region';
    protected BasePort: string = '80';

    constructor(public http: Http) { super(); }

    public get(): Observable<string[]> {
        const countryRequestsByRegion = ['africa', 'americas', 'asia', 'europe', 'oceania'].map(region => {
            return this.http.get(`${this.BaseUrl}/${region}?fields=name`);
        });

        return Observable.merge(...countryRequestsByRegion)
            .map(res => {
                let data = res.json();
                return data.map(value => { return value.name; });
            })
            .catch(this.handleError);
    }
}