// tslint:disable:no-shadowed-variable
import { Fn, Curried2, BinaryOp } from './types'
import { Predicate, Refinement } from './predicates'

export function compose<As extends any[], B, C>(
  bc: Fn<[B], C>,
  ab: Fn<As, B>,
): Fn<As, C>
export function compose<As extends any[], B, C, D>(
  cd: Fn<[C], D>,
  bc: Fn<[B], C>,
  ab: Fn<As, B>,
): Fn<As, D>
export function compose<As extends any[], B, C, D, E>(
  de: Fn<[D], E>,
  cd: Fn<[C], D>,
  bc: Fn<[B], C>,
  ab: Fn<As, B>,
): Fn<As, E>
export function compose<As extends any[], B, C, D, E, F>(
  ef: Fn<[E], F>,
  de: Fn<[D], E>,
  cd: Fn<[C], D>,
  bc: Fn<[B], C>,
  ab: Fn<As, B>,
): Fn<As, F>
export function compose<As extends any[], B, C, D, E, F, G>(
  fg: Fn<[F], G>,
  ef: Fn<[E], F>,
  de: Fn<[D], E>,
  cd: Fn<[C], D>,
  bc: Fn<[B], C>,
  ab: Fn<As, B>,
): Fn<As, G>
export function compose<As extends any[], B, C, D, E, F, G, H>(
  gh: Fn<[G], H>,
  fg: Fn<[F], G>,
  ef: Fn<[E], F>,
  de: Fn<[D], E>,
  cd: Fn<[C], D>,
  bc: Fn<[B], C>,
  ab: Fn<As, B>,
): Fn<As, H>
export function compose<As extends any[], B, C, D, E, F, G, H, I>(
  hi: Fn<[H], I>,
  gh: Fn<[G], H>,
  fg: Fn<[F], G>,
  ef: Fn<[E], F>,
  de: Fn<[D], E>,
  cd: Fn<[C], D>,
  bc: Fn<[B], C>,
  ab: Fn<As, B>,
): Fn<As, I>
export function compose<As extends any[], B, C, D, E, F, G, H, I, J>(
  ij: Fn<[I], J>,
  hi: Fn<[H], I>,
  gh: Fn<[G], H>,
  fg: Fn<[F], G>,
  ef: Fn<[E], F>,
  de: Fn<[D], E>,
  cd: Fn<[C], D>,
  bc: Fn<[B], C>,
  ab: Fn<As, B>,
): Fn<As, J>
// tslint:disable-next-line:ban-types
export function compose(...fns: Function[]) {
  const len = fns.length - 1
  return function(this: any, ...args: any[]) {
    let y = args
    for (let i = len; i > -1; i--) {
      y = [fns[i].call(this, ...y)]
    }
    return y[0]
  }
}

export function pipe<As extends any[], B, C>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
): Fn<As, C>
export function pipe<As extends any[], B, C, D>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
): Fn<As, D>
export function pipe<As extends any[], B, C, D, E>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
): Fn<As, E>
export function pipe<As extends any[], B, C, D, E, F>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
  ef: Fn<[E], F>,
): Fn<As, F>
export function pipe<As extends any[], B, C, D, E, F, G>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
  ef: Fn<[E], F>,
  fg: Fn<[F], G>,
): Fn<As, G>
export function pipe<As extends any[], B, C, D, E, F, G, H>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
  ef: Fn<[E], F>,
  fg: Fn<[F], G>,
  gh: Fn<[G], H>,
): Fn<As, H>
export function pipe<As extends any[], B, C, D, E, F, G, H, I>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
  ef: Fn<[E], F>,
  fg: Fn<[F], G>,
  gh: Fn<[G], H>,
  hi: Fn<[H], I>,
): Fn<As, I>
export function pipe<As extends any[], B, C, D, E, F, G, H, I, J>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
  ef: Fn<[E], F>,
  fg: Fn<[F], G>,
  gh: Fn<[G], H>,
  hi: Fn<[H], I>,
  ij: Fn<[I], J>,
): Fn<As, J>
// tslint:disable-next-line:ban-types
export function pipe(...fns: Function[]): Function {
  const len = fns.length - 1
  return function(this: any, ...args: any[]) {
    let y = args
    for (let i = 0; i <= len; i++) {
      y = [fns[i].call(this, ...y)]
    }
    return y[0]
  }
}

/**
 * The I combinator aka the identity function
 *
 * Takes an argument and returns it
 * @param a a value
 */
export const I = <A>(a: A) => a
export { I as id }

/**
 * The K combinator
 *
 * Takes two values and returns the first
 */
export const K = <A>(a: A) => <B>(_b?: B) => a
export { K as constant }
/**
 * The T (thrush) combinator
 *
 * Takes a value and a function and applies the function to the value
 */
export const T = <A>(a: A) => <B>(fn: (v: A) => B) => fn(a)

export function flip<R>(fn: <A, B>(a: A, b: B) => R): <A, B>(b: B, a: A) => R
export function flip<R>(fn: <A>(a: A, b: A) => R): <A>(b: A, a: A) => R
export function flip<Fixed, R>(
  fn: <A>(a: A, b: Fixed) => R,
): <A>(b: Fixed, a: A) => R
export function flip<Fixed, R>(
  fn: <B>(a: Fixed, b: B) => R,
): <B>(b: B, a: Fixed) => R
export function flip<Fixed1, Fixed2, R>(
  fn: Fn<[Fixed1, Fixed2], R>,
): Fn<[Fixed2, Fixed1], R>
export function flip<A, B, C>(fn: Fn<[A, B], C>): (b: B, a: A) => C {
  return (b, a) => fn(a, b)
}
/*
declare function fn1<A>(a: A, b: A): boolean
declare function fn2<A>(a: A, b: number): boolean
declare function fn3<A>(a: number, b: A): boolean
declare function fn4<A, B>(a: A, b: B): boolean
declare function fn5(a: string, b: number): boolean
flip(fn1)
flip(fn2)
flip(fn3)
flip(fn4)
flip(fn5)
*/

export function flipC<R>(
  fn: <A>(a: A) => <B>(b: B) => R,
): <B>(b: B) => <A>(a: A) => R
export function flipC<R>(fn: <A>(a: A) => (b: A) => R): <A>(b: A) => (a: A) => R
export function flipC<Fixed, R>(
  fn: <A>(a: A) => (b: Fixed) => R,
): (b: Fixed) => <A>(a: A) => R
export function flipC<Fixed, R>(
  fn: (a: Fixed) => <B>(b: B) => R,
): <B>(b: B) => (a: Fixed) => R
export function flipC<Fixed1, Fixed2, R>(
  fn: Curried2<Fixed1, Fixed2, R>,
): Curried2<Fixed2, Fixed1, R>
export function flipC<A, B, C>(fn: Curried2<A, B, C>): Curried2<B, A, C> {
  return b => a => fn(a)(b)
}

/*
declare function fn1(a: number): (b: string) => boolean
declare function fn2<A>(a: A): (b: string) => boolean
declare function fn3(a: number): <B>(b: B) => boolean
declare function fn4<A>(a: A): (b: A) => boolean
declare function fn5<A>(a: A): <B>(b: B) => boolean
flipC(fn1)
flipC(fn2)
flipC(fn3)
flipC(fn4)
flipC(fn5)
*/

export const tuple = <T extends any[]>(...args: T): T => args
export const fst = <A>(t: [A, ...any[]]) => t[0]
export const snd = <A, B>(t: [A, B, ...any[]]) => t[1]

export const gt = (a: number, b: number) => a > b
export const eq = (a: number, b: number) => a === b
export const lt = (a: number, b: number) => a < b
export const lte = (a: number, b: number) => a <= b
export const gte = (a: number, b: number) => a >= b
export const property = <T, K extends keyof T>(prop: K) => (o: T) => o[prop]
/** Changes the domain of a binary operator */
export const on = <B, C>(op: BinaryOp<B, C>) => <A>(
  f: (a: A) => B,
): BinaryOp<A, C> => x => y => op(f(x))(f(y))

// (t1 -> t2) -> (t3 -> t2 -> t4) -> (t3 -> t1 -> t4)
export const mapT = <t1, t2>(fn: (a: t1) => t2) => <t3, t4>(
  step: (acc: t3, curr: t2) => t4,
) => (acc: t3, curr: t1) => step(acc, fn(curr))

// (t -> Bool) -> (p -> t -> p) -> p -> t -> p
export function filterT<t, u extends t>(
  fn: Refinement<t, u>,
): <p>(step: (acc: p, curr: u) => p) => (acc: p, curr: t) => p
export function filterT<t>(
  fn: Predicate<t>,
): <p>(step: (acc: p, curr: t) => p) => (acc: p, curr: t) => p
export function filterT<t>(
  fn: Predicate<t>,
): <p>(step: (acc: p, curr: t) => p) => (acc: p, curr: t) => p {
  return step => (acc, curr) => (fn(curr) ? step(acc, curr) : acc)
}
