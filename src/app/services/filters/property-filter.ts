import { Filter } from './filter.abstract'
import { BehaviorSubject } from 'rxjs'

export class PropertyFilter<T> extends Filter {
  public _filter: { key: string; value: any } | null = null

  protected dataChangeSource: BehaviorSubject<{
    key: string
    value: any
  } | null>

  constructor(name: string) {
    super(name)
    this.dataChangeSource = new BehaviorSubject<{
      key: string
      value: any
    } | null>(null)
    this.dataChangeSource.subscribe(filter => {
      this._filter = filter
    })
  }

  public applyFilter(data: T[]): T[] {
    if (!this._filter) return data
    return data.filter(d => {
      if (this._filter && this._filter.value instanceof Array) {
        return new Set(this._filter.value).has((d as any)[this._filter.key])
      }
      return this._filter && (d as any)[this._filter.key] === this._filter.value
    })
  }
}
