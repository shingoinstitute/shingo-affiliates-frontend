import { Filter } from './filter.abstract';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class TextFilter<T> extends Filter {

  protected dataChangeSource: BehaviorSubject<string>;

  public _filter: string;

  constructor(name: string) {
    super(name);
    this.dataChangeSource = new BehaviorSubject<string>(null);
    this.dataChangeSource.subscribe(filter => this._filter = filter);
  }

  public applyFilter(data: T[]): T[] {
    if ((typeof this._filter !== 'string')) return data;
    return data.filter(d => JSON.stringify(d).toLowerCase().includes(this._filter.toLowerCase()));
  }

}