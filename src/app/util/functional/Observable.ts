import { Observable, of, merge, combineLatest, empty } from 'rxjs'
import { mergeMap, map } from 'rxjs/operators'

declare module 'rxjs/internal/Observable' {
  interface Observable<T> {
    readonly _URI: URI
    readonly _A: T
  }
}

declare module './HKT' {
  interface URI2HKT<A> {
    Observable: Observable<A>
  }
}

export const URI = 'Observable'
export type URI = typeof URI

export {
  of,
  map,
  merge as alt,
  mergeMap as chain,
  combineLatest as ap,
  empty as zero,
}
