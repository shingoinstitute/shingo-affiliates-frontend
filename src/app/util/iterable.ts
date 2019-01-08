import { Fn, Predicate, Refinement } from './functional'

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
