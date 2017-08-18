import { Filter } from './filter.abstract';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class TextFilter<T> extends Filter {

    private _filter: string;
    protected dataChangeSource: BehaviorSubject<string>;

    constructor() {
        super();
        this.dataChangeSource = new BehaviorSubject<string>(null);
        this.dataChangeSource.subscribe(filter => this._filter = filter);
    }

    public applyFilter(data: T[]): T[] {
        if (!this._filter) return data;
        return data.filter(d => JSON.stringify(d).includes(this._filter));
    }

}