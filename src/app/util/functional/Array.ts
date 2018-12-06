import { Maybe, isJust } from './Maybe'
import { id } from './functional'
import { Applicative, Applicative1 } from './structures/Applicative'
import { HKT } from './HKT'
import { Sequence1, Traversable1, Traverse1 } from './structures/Traversable'

declare global {
  interface Array<T> {
    _URI: URI
    _A: T
  }
}

declare module './HKT' {
  interface URI2HKT<A> {
    Array: A[]
  }
}

export const URI = 'Array'
export type URI = typeof URI

export const length = <A>(xs: A[]) => xs.length
export const reduce1 = <A>(fa: A[], fn: (b: A, a: A) => A) => fa.reduce(fn)
export const reduce1C = <A>(fn: (b: A, a: A) => A) => (fa: A[]) => fa.reduce(fn)
export const reduce = <A, B>(fa: A[], b: B, fn: (b: B, a: A) => B) =>
  fa.reduce(fn, b)
export const reduceC = <A, B>(fn: (b: B, a: A) => B) => (b: B) => (fa: A[]) =>
  fa.reduce(fn, b)
export const of = <A>(a: A): A[] => [a]
export const map = <A, B>(fa: A[], fn: (a: A) => B) => fa.map(fn)
export const mapC = <A, B>(fn: (a: A) => B) => (fa: A[]) => fa.map(fn)
export const filter = <A>(
  fa: A[],
  fn: (a: A, index: number, array: A[]) => boolean,
) => fa.filter(fn)
export const filterC = <A>(
  fn: (a: A, index: number, array: A[]) => boolean,
) => (fa: A[]) => fa.filter(fn)

export const empty: never[] = []
export const zero = <A>(): A[] => []
export const ap = <A, B>(fab: Array<(a: A) => B>, fa: A[]): B[] =>
  flatten(map(fab, f => map(fa, f)))

export const traverse: Traverse1<URI> = <F>(F: Applicative<F>) => <A, B>(
  ta: A[],
  f: (a: A) => HKT<F, B>,
) =>
  reduce(ta, F.of<B[]>(zero()), (fbs, a) =>
    F.ap(F.map(fbs, bs => (b: B) => append(bs, b)), f(a)),
  )

export const sequence: Sequence1<URI> = <F>(F: Applicative<F>) => <A>(
  ta: Array<HKT<F, A>>,
): HKT<F, A[]> =>
  reduce(ta, F.of<A[]>(zero()), (fas, fa) =>
    F.ap(F.map(fas, as => (a: A) => append(as, a)), fa),
  )

export const copy = <A>(as: A[]): A[] => {
  const l = as.length
  const r = Array(l)
  for (let i = 0; i < l; i++) {
    r[i] = as[i]
  }
  return r
}

export const cons = <A>(a: A, as: A[]): A[] => {
  const l = as.length
  const arr = new Array(as.length + 1)
  arr[0] = a
  for (let i = 0; i < l; i++) {
    arr[i + 1] = as[i]
  }
  return arr
}

export const consC = <A>(a: A) => (as: A[]) => cons(a, as)

export const append = <A>(as: A[], a: A): A[] => {
  const r = copy(as)
  r.push(a)
  return r
}

export const appendC = <A>(as: A[]) => (a: A): A[] => append(as, a)

// from gcanti/fp-ts
export const flatten = <A>(ffa: A[][]): A[] => {
  let rLen = 0
  const len = ffa.length
  for (let i = 0; i < len; i++) {
    rLen += ffa[i].length
  }
  const r = Array(rLen)
  let start = 0
  for (let i = 0; i < len; i++) {
    const arr = ffa[i]
    const l = arr.length
    for (let j = 0; j < l; j++) {
      r[j + start] = arr[j]
    }
    start += l
  }
  return r
}

export const mapOnMaybe = <A, B>(as: A[], f: (a: A) => Maybe<B>): B[] =>
  as.reduce(
    (acc, curr) => {
      const r = f(curr)
      if (isJust(r)) {
        acc.push(r.value)
      }
      return acc
    },
    [] as B[],
  )

export const mapOnMaybeC = <A, B>(f: (a: A) => Maybe<B>) => (as: A[]): B[] =>
  mapOnMaybe(as, f)

export const catMaybes = <A>(as: Array<Maybe<A>>): A[] => mapOnMaybe(as, id)

/**
 * Partitions an iterable into two arrays
 *
 * If the given function returns a Left for some value,
 * that value is added to the left array,
 * otherwise the value is added to the right array
 *
 * @param fa some iterable
 * @param f the discriminator function
 */
export function partitionMap<A, L, R>(
  fa: Iterable<A>,
  f: (a: A) => Either<L, R>,
): { left: L[]; right: R[] }
/**
 * Partitions an iterable into two arrays
 *
 * If the given function returns false for some value,
 * that value is added to the left array,
 * otherwise the value is added to the right array
 *
 * @param fa some iterable
 * @param f the discriminator function
 */
export function partitionMap<A>(
  fa: Iterable<A>,
  f: (a: A) => boolean,
): { left: A[]; right: A[] }
/**
 * Partitions an iterable into two arrays
 *
 * If the given function returns a Left or false for some value,
 * that value is added to the left array,
 * otherwise it the value is added to the right array
 *
 * @param fa some iterable
 * @param f the discriminator function
 */
export function partitionMap<A, L, R>(
  fa: Iterable<A>,
  f: (a: A) => boolean | Either<L, R>,
): { left: Array<A | L>; right: Array<A | R> }
export function partitionMap<A, L, R>(
  fa: Iterable<A>,
  f: (a: A) => boolean | Either<L, R>,
): { left: Array<A | L>; right: Array<A | R> } {
  const left: Array<A | L> = []
  const right: Array<A | R> = []

  for (const a of fa) {
    const e = f(a)
    if (typeof e === 'boolean') {
      if (e) {
        right.push(a)
      } else {
        left.push(a)
      }
    } else {
      if (isLeft(e)) {
        left.push(e[1])
      } else {
        right.push(e[1])
      }
    }
  }

  return { left, right }
}

// sanity check for the module
import * as module from './Array'
import { the } from './types'
import { Functor1 } from './structures/Functor'
import { Foldable1 } from './structures/Foldable'
import { Either, isLeft } from './Either'

the<Functor1<URI>, typeof module>()
the<Foldable1<URI>, typeof module>()
the<Applicative1<URI>, typeof module>()
the<Traversable1<URI>, typeof module>()
