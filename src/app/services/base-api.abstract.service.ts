// App Modules
import { HttpService } from './http/http.service';
import { BaseService } from './base.abstract.service';

// RxJS Modules
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

// RxJS operators
import 'rxjs/add/observable/throw';

export interface SFSuccessResult {
    id: string,
    success: boolean,
    errors: any[]
}

export abstract class BaseAPIService extends BaseService {
    protected BaseUrl: string = "http://129.123.47.34";
    protected BasePort: string = "8080";

    protected APIHost() { return `${this.BaseUrl}:${this.BasePort}`; }

    // Contract for all APIServices;
    public abstract getAll(): Observable<any[]>;
    public abstract getById(id: string): Observable<any>;
    public abstract create(obj: any): Observable<SFSuccessResult>;
    public abstract update(obj: any): Observable<SFSuccessResult>;
    public abstract delete(obj: any): Observable<SFSuccessResult>;
    public abstract search(query: string): Observable<any[]>;

    public describe(route: 'workshops' | 'facilitators' | 'affiliates', http: HttpService): Observable<any> {
        return http.get(`${this.APIHost()}/${route}/describe`)
            .map(res => {
                let data = res.json();
                console.log('describe', data);
                let props = {};
                data.fields.filter(field => {
                    return field.inlineHelpText || field.label || field.picklistValues;
                })
                    .map(field => {
                        let props = {};
                        if (field.inlineHelpText)
                            props['inlineHelpText'] = field.inlineHelpText;
                        if (field.label)
                            props['label'] = field.label;
                        if (field.name)
                            props['name'] = field.name;
                        if (field.picklistValues && field.picklistValues.length > 0)
                            props['picklistValues'] = field.picklistValues;
                        return props;
                    })
                    .forEach(field => {
                        props[this.toCamelCase(field.name)] = field;
                    });
                return props;
            })
            .catch(this.handleError);
    }
}