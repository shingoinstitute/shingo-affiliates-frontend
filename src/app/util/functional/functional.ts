import { Function1, Lazy } from './types'
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
 * The identity function
 * @param a a value
 */
export const id = <A>(a: A) => a
export const constant = <A>(a: A): Lazy<A> => () => a

export const tuple = <T extends any[]>(...args: T): T => args
export const fst = <A>(t: [A, ...any[]]) => t[0]
export const snd = <A, B>(t: [A, B, ...any[]]) => t[1]
