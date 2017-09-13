import { Filter } from '../filter.abstract';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Workshop } from '../../../workshops/workshop.model';

export class WorkshopDateRangeFilter extends Filter {

  protected dataChangeSource: BehaviorSubject<DateRange>;

  public _range: DateRange;

  constructor(name: string) {
    super(name);
    this.dataChangeSource = new BehaviorSubject<DateRange>(null);
    this.dataChangeSource.subscribe(range => this._range = range);
  }

  public applyFilter(workshops: Workshop[]): Workshop[] {
    if (!this._range) return workshops;
    else if (this._range[0] && this._range[1]) {
      return workshops.filter(w => {
        return this.greaterThanWithoutTime(new Date(w.startDate), new Date(this._range[0]))
          && this.lessThanWithoutTime(new Date(w.endDate), new Date(this._range[1]));
      });
    } else if (this._range[0]) {
      return workshops.filter(w => this.greaterThanWithoutTime(new Date(w.startDate), new Date(this._range[0])));
    } else if (this._range[1]) {
      return workshops.filter(w => this.lessThanWithoutTime(new Date(w.endDate), new Date(this._range[1])));
    } else {
      return workshops;
    }
  }

  public greaterThanWithoutTime(a: Date, b: Date): boolean {
    a.setHours(0, 0, 0, 0);
    b.setHours(0, 0, 0, 0);
    return a >= b;
  }

  public lessThanWithoutTime(a: Date, b: Date): boolean {
    a.setHours(0, 0, 0, 0);
    b.setHours(0, 0, 0, 0);
    return a <= b;
  }

}