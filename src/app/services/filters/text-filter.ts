import { Filter } from './filter.abstract'
import { BehaviorSubject } from 'rxjs'

export class TextFilter<T> extends Filter {
  public _filter: string | null = null

  protected dataChangeSource: BehaviorSubject<string | null>

  constructor(name: string) {
    super(name)
    this.dataChangeSource = new BehaviorSubject<string | null>(null)
    this.dataChangeSource.subscribe(filter => {
      this._filter = filter
    })
  }

  /**
   * @desc - applyFilter accepts an array of data, then applies it's filter to the data
   * and returns the filtered data.
   * @param data
   */
  public applyFilter(data: T[]): T[] {
    if (typeof this._filter !== 'string') return data
    return data.filter(
      d =>
        this._filter &&
        JSON.stringify(d)
          .toLowerCase()
          .includes(this._filter.toLowerCase()),
    )
  }
}
