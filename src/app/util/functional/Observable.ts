import { Observable, of, merge, combineLatest, empty } from 'rxjs'
import { mergeMap, map as obsMap } from 'rxjs/operators'

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

export const map: Functor1<URI>['map'] = <A, B>(
  fa: Observable<A>,
  f: (a: A) => B,
) => obsMap(f)(fa)

export { of, obsMap as mapC, merge as alt, mergeMap as chainC, empty as zero }

// sanity check
import * as module from './Observable'
import { the } from './types'
import { Functor1 } from './structures/Functor'

the<Functor1<URI>, typeof module>()
