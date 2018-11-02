// tslint:disable:no-shadowed-variable
import { Function1, Lazy, Function2, Curried2 } from './types'
// many functions here are from gcanti/fp-ts. All credit to them

export function compose<A, B, C>(
  bc: Function1<B, C>,
  ab: Function1<A, B>,
): Function1<A, C>
export function compose<A, B, C, D>(
  cd: Function1<C, D>,
  bc: Function1<B, C>,
  ab: Function1<A, B>,
): Function1<A, D>
export function compose<A, B, C, D, E>(
  de: Function1<D, E>,
  cd: Function1<C, D>,
  bc: Function1<B, C>,
  ab: Function1<A, B>,
): Function1<A, E>
export function compose<A, B, C, D, E, F>(
  ef: Function1<E, F>,
  de: Function1<D, E>,
  cd: Function1<C, D>,
  bc: Function1<B, C>,
  ab: Function1<A, B>,
): Function1<A, F>
export function compose<A, B, C, D, E, F, G>(
  fg: Function1<F, G>,
  ef: Function1<E, F>,
  de: Function1<D, E>,
  cd: Function1<C, D>,
  bc: Function1<B, C>,
  ab: Function1<A, B>,
): Function1<A, G>
export function compose<A, B, C, D, E, F, G, H>(
  gh: Function1<G, H>,
  fg: Function1<F, G>,
  ef: Function1<E, F>,
  de: Function1<D, E>,
  cd: Function1<C, D>,
  bc: Function1<B, C>,
  ab: Function1<A, B>,
): Function1<A, H>
export function compose<A, B, C, D, E, F, G, H, I>(
  hi: Function1<H, I>,
  gh: Function1<G, H>,
  fg: Function1<F, G>,
  ef: Function1<E, F>,
  de: Function1<D, E>,
  cd: Function1<C, D>,
  bc: Function1<B, C>,
  ab: Function1<A, B>,
): Function1<A, I>
export function compose<A, B, C, D, E, F, G, H, I, J>(
  ij: Function1<I, J>,
  hi: Function1<H, I>,
  gh: Function1<G, H>,
  fg: Function1<F, G>,
  ef: Function1<E, F>,
  de: Function1<D, E>,
  cd: Function1<C, D>,
  bc: Function1<B, C>,
  ab: Function1<A, B>,
): Function1<A, J>
// tslint:disable-next-line:ban-types
export function compose(...fns: Function[]) {
  const len = fns.length - 1
  return function(this: any, x: any) {
    let y = x
    for (let i = len; i > -1; i--) {
      y = fns[i].call(this, y)
    }
    return y
  }
}

export function pipe<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (a: A) => C
export function pipe<A, B, C, D>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
): (a: A) => D
export function pipe<A, B, C, D, E>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
): (a: A) => E
export function pipe<A, B, C, D, E, F>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
): (a: A) => F
export function pipe<A, B, C, D, E, F, G>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
): (a: A) => G
export function pipe<A, B, C, D, E, F, G, H>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
): (a: A) => H
export function pipe<A, B, C, D, E, F, G, H, I>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
): (a: A) => I
export function pipe<A, B, C, D, E, F, G, H, I, J>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
): (a: A) => J
// tslint:disable-next-line:ban-types
export function pipe(...fns: Function[]): Function {
  const len = fns.length - 1
  return function(this: any, x: any) {
    let y = x
    for (let i = 0; i <= len; i++) {
      y = fns[i].call(this, y)
    }
    return y
  }
}

/**
 * The I combinator aka the identity function
 *
 * Takes an argument and returns it
 * @param a a value
 */
export const id = <A>(a: A) => a
export { id as I }

/**
 * The K combinator
 *
 * Takes two values and returns the first
 */
export const K = <A>(a: A) => <B>(_b: B) => a
export const constant: <A>(a: A) => Lazy<A> = K as any
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
  fn: Function2<Fixed1, Fixed2, R>,
): Function2<Fixed2, Fixed1, R>
export function flip<A, B, C>(fn: Function2<A, B, C>): (b: B, a: A) => C {
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
