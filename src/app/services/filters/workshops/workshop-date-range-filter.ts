import { Filter } from '../filter.abstract';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Workshop } from '../../../workshops/Workshop';

export class WorkshopDateRangeFilter extends Filter {

    private _range: DateRange;
    protected dataChangeSource: BehaviorSubject<DateRange>;

    constructor() {
        super();
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

    private greaterThanWithoutTime(a: Date, b: Date): boolean {
        a.setHours(0, 0, 0, 0);
        b.setHours(0, 0, 0, 0);
        return a >= b;
    }

    private lessThanWithoutTime(a: Date, b: Date): boolean {
        a.setHours(0, 0, 0, 0);
        b.setHours(0, 0, 0, 0);
        return a <= b;
    }

}