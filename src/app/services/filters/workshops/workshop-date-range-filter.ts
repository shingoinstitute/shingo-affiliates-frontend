import { Filter } from '../filter.abstract'
import { Workshop } from '../../../workshops/workshop.model'
import { and, constant } from '../../../util/functional'
import { withoutTime } from '../../../util/util'
import { Moment } from 'moment'

// tslint:disable-next-line:prettier
// prettier-ignore
export type DateRange = [(Date | Moment | null)?, (Date | Moment | null)?]

export class WorkshopDateRangeFilter extends Filter<Workshop, DateRange> {
  constructor(name: string) {
    super(name)
  }

  private _endsBefore = (d: Date | Moment) => (w: Workshop) =>
    this.lessThanWithoutTime(w.endDate, d)

  private _startsAfter = (d: Date | Moment) => (w: Workshop) =>
    this.greaterThanWithoutTime(w.startDate, d)

  _filter = (range: DateRange) => {
    const startsAfter = range[0]
    const endsBefore = range[1]

    if (startsAfter && endsBefore) {
      return and(this._startsAfter(startsAfter), this._endsBefore(endsBefore))
    } else if (startsAfter) {
      return this._startsAfter(startsAfter)
    } else if (endsBefore) {
      return this._endsBefore(endsBefore)
    }
    return constant(true)
  }

  public greaterThanWithoutTime(a: Date | Moment, b: Date | Moment): boolean {
    return withoutTime(a) >= withoutTime(b)
  }

  public lessThanWithoutTime(a: Date | Moment, b: Date | Moment): boolean {
    return withoutTime(a) <= withoutTime(b)
  }
}
