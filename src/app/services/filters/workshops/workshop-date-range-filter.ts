import { Filter } from '../filter.abstract'
import { BehaviorSubject } from 'rxjs'
import { Workshop } from '../../../workshops/workshop.model'

export class WorkshopDateRangeFilter extends Filter {
  public _range: DateRange | null = null

  protected dataChangeSource: BehaviorSubject<DateRange | null>

  constructor(name: string) {
    super(name)
    this.dataChangeSource = new BehaviorSubject<DateRange | null>(null)
    this.dataChangeSource.subscribe(range => {
      this._range = range
    })
  }

  public applyFilter(workshops: Workshop[]): Workshop[] {
    if (!this._range) return workshops
    const range = this._range
    if (range[0] && range[1]) {
      return workshops.filter(
        w =>
          this.greaterThanWithoutTime(
            new Date(w.startDate),
            new Date(range[0]),
          ) &&
          this.lessThanWithoutTime(new Date(w.endDate), new Date(range[1])),
      )
    } else if (range[0]) {
      return workshops.filter(w =>
        this.greaterThanWithoutTime(new Date(w.startDate), new Date(range[0])),
      )
    } else if (range[1]) {
      return workshops.filter(w =>
        this.lessThanWithoutTime(new Date(w.endDate), new Date(range[1])),
      )
    } else {
      return workshops
    }
  }

  public greaterThanWithoutTime(a: Date, b: Date): boolean {
    a.setHours(0, 0, 0, 0)
    b.setHours(0, 0, 0, 0)
    return a >= b
  }

  public lessThanWithoutTime(a: Date, b: Date): boolean {
    a.setHours(0, 0, 0, 0)
    b.setHours(0, 0, 0, 0)
    return a <= b
  }
}
