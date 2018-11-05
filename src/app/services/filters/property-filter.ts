import { Filter } from './filter.abstract'

export interface PropertyDef {
  key: string
  value: any
}

export class PropertyFilter<T> extends Filter<T, PropertyDef> {
  _filter = (criteria: PropertyDef) => (d: T): boolean => {
    if (typeof d !== 'object' || d === null) return false

    if (criteria.value instanceof Array) {
      return new Set(criteria.value).has((d as any)[criteria.key])
    }

    return (d as any)[criteria.key] === criteria.value
  }
}
