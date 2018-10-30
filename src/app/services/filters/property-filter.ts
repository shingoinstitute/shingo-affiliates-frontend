import { Filter } from './filter.abstract'
import { BehaviorSubject } from 'rxjs'

interface PropertyDef {
  key: string
  value: any
}

export class PropertyFilter<T> extends Filter<T, PropertyDef> {
  constructor(name: string) {
    super(name)
  }

  protected _filter = (criteria: PropertyDef) => (d: T): boolean => {
    if (typeof d !== 'object' || d === null) return false

    if (criteria.value instanceof Array) {
      return new Set(criteria.value).has((d as any)[criteria.key])
    }

    return (d as any)[criteria.key] === criteria.value
  }
}
