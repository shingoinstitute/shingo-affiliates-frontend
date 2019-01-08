import { Filter } from './filter.abstract'

export interface PropertyDef<T, K extends keyof T = keyof T> {
  key: K
  value: T[K] | Array<T[K]>
}

export class PropertyFilter<T> extends Filter<T, PropertyDef<T>> {
  _filter = (criteria: PropertyDef<T>) => (d: T): boolean => {
    if (typeof d !== 'object' || d === null) return false

    if (criteria.value instanceof Array) {
      return new Set(criteria.value).has(d[criteria.key])
    }

    return d[criteria.key] === criteria.value
  }

  setCriteria<K extends keyof T>(key: K, value: T[K] | Array<T[K]>): this {
    this.criteria = { key, value }
    return this
  }
}
