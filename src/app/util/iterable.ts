import { Fn, Predicate, Refinement } from './functional'
import { Monoid, monoidString } from 'fp-ts/lib/Monoid'

export function* repeat<A>(x: A, n: number) {
  let i = n
  while (i-- > 0) yield x
}

export function* map<A, B>(iter: Iterable<A>, fn: Fn<[A], B>) {
  for (const value of iter) {
    yield fn(value)
  }
}

export function* filter<A, B extends A = A>(
  iter: Iterable<A>,
  fn: Refinement<A, B> | Predicate<A>,
) {
  for (const value of iter) {
    if (fn(value)) yield value
  }
}

export function reduce<A, B>(
  it: Iterable<A>,
  fn: (acc: B, curr: A) => B,
  init: B,
) {
  let o = init

  for (const x of it) o = fn(o, x)

  return o
}

export const fold = <M>(M: Monoid<M>) => (xs: Iterable<M>): M =>
  reduce(xs, M.concat, M.empty)

/**
 * Haksell implementation
 * ```haskell
 * intersperse :: a -> [a] -> [a]
 * intersperse _ [] = []
 * intersperse sep (x:xs) = x : prepend sep xs
 *    where
 *      prepend _ [] = []
 *      prepend sep (x:xs) = sep : x : prepend sep xs
 * ```
 */
export const intersperse = <A>(sep: A) =>
  function*(xs: Iterable<A>) {
    // case 1. xs = [] => []
    // case 2. xs = [1] => [1]
    // case 3. xs = [1..] => [1, sep, ..]

    let first = true
    let firstVal = [] as A[]
    for (const x of xs) {
      // don't yield on the first, just store
      // on second if we have stored value, yield* [stored, sep, x]
      // rest just yield* [sep, x]
      if (first) {
        firstVal.push(x)
        first = false
      } else {
        // case 3. xs = [1..] => [1, sep, ..]
        // if we hit this case, val should be filled
        yield* firstVal
        yield sep
        yield x

        // reset so we don't yield final
        firstVal = []
      }
    }

    // if val.length > 0
    // case 1. xs = [] => []
    // case 2. xs = [1] => [1]
    yield* firstVal
  }

export function* concat<A>(xss: Iterable<Iterable<A>>) {
  for (const xs of xss) yield* xs
}

export const intercalate = <A>(xs: Iterable<A>) => (
  xss: Iterable<Iterable<A>>,
) => concat(intersperse(xs)(xss))

export const join = (xs: Iterable<string>, sep = ''): string =>
  fold(monoidString)(intersperse(sep)(xs))

export function* scan<A, B>(
  it: Iterable<A>,
  fn: (acc: B, curr: A) => B,
  init: B,
) {
  let o = init

  let empty = true
  for (const x of it) {
    empty = false
    o = fn(o, x)
    yield o
  }
  if (empty) yield o
}

export const take = (num: number) =>
  function*<A>(it: Iterable<A>) {
    let count = 0
    for (const x of it) {
      if (count++ === num) return
      yield x
    }
  }

export const mapC = <A, B>(fn: Fn<[A], B>) => (iter: Iterable<A>) =>
  map(iter, fn)

export const filterC = <A, B extends A = A>(
  pred: Refinement<A, B> | Predicate<A>,
) => (iter: Iterable<A>) => filter(iter, pred)
