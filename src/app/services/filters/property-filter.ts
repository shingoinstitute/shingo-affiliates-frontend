import { Filter } from './filter.abstract';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class PropertyFilter<T> extends Filter {

    private _filter: { key: string, value: any };
    protected dataChangeSource: BehaviorSubject<{ key: string, value: any }>;

    constructor() {
        super();
        this.dataChangeSource = new BehaviorSubject<{ key: string, value: any }>(null);
        this.dataChangeSource.subscribe(filter => this._filter = filter);
    }

    public applyFilter(data: T[]): T[] {
        if (!this._filter) return data;
        return data.filter(d => {
            if (this._filter.value instanceof Array) return new Set(this._filter.value).has(d[this._filter.key]);
            return d[this._filter.key] === this._filter.value;
        });
    }

}