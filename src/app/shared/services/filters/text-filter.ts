import { Filter } from './filter.abstract'

export class TextFilter<T> extends Filter<T, string> {
  _filter = (criteria: string) => (d: T): boolean => {
    return JSON.stringify(d)
      .toLowerCase()
      .includes(criteria.toLowerCase())
  }
}
