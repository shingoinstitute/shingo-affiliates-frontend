import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { BaseService } from './base.abstract.service';
import { without } from 'lodash';

@Injectable()
export class CountriesService extends BaseService {

    protected BaseUrl: string = 'https://restcountries.eu/rest/v2/region';
    protected BasePort: string = '80';

    constructor(public http: Http) { super(); }

    public get(): Observable<string[]> {
        const countryRequestsByRegion = ['africa', 'americas', 'asia', 'europe', 'oceania'].map(region => {
            return this.http.get(`${this.BaseUrl}/${region}?fields=name`);
        });

        const filterNames = ['United Kingdom of Great Britain and Northern Ireland', 'United States of America', 'United Kingdom', 'United States'];
        return Observable.merge(...countryRequestsByRegion)
            .map(res => {
                const data = res.json();
                let countryNames = data.map(value => { return value.name; }).sort();
                countryNames = without(countryNames, filterNames);
                countryNames = ['United States', 'United Kingdom'].concat(countryNames);
                return countryNames;
            })
            .catch(this.handleError);
    }

}