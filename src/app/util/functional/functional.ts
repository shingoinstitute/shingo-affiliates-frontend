// tslint:disable:no-shadowed-variable
import { Fn, BinaryOp } from './types'
import { Predicate, Refinement } from './PredCombinators'

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

/** both multivariate-parameterized */
export type FlipC_MpMp = <R>(
  fn: <As extends any[]>(...as: As) => <Bs extends any[]>(...bs: Bs) => R,
) => <Bs extends any[]>(...bs: Bs) => <As extends any[]>(...as: As) => R

/** first multivariate-parameterized, second same */
export type FlipC_MpS = <R>(
  fn: <As extends any[]>(...as: As) => (...bs: As) => R,
) => <As extends any[]>(...bs: As) => (...as: As) => R

/** first multivariate-parameterized, second concrete */
export type FlipC_MpC = <Fixed extends any[], R>(
  fn: <As extends any[]>(...as: As) => (...bs: Fixed) => R,
) => (...bs: Fixed) => <As extends any[]>(...as: As) => R

/** first concrete, second multivariate-parameterized */
export type FlipC_CMp = <Fixed extends any[], R>(
  fn: (...as: Fixed) => <Bs extends any[]>(...bs: Bs) => R,
) => <Bs extends any[]>(...bs: Bs) => (...as: Fixed) => R

/** both concrete */
export type FlipC_CC = <Fixed1 extends any[], Fixed2 extends any[], R>(
  fn: (...as: Fixed1) => (...bs: Fixed2) => R,
) => (...bs: Fixed2) => (...as: Fixed1) => R

/** both parameterized */
export type FlipC_PP = <R>(
  fn: <A>(a: A) => <B>(b: B) => R,
) => <B>(b: B) => <A>(a: A) => R

/** first parameterized, second same */
export type FlipC_PS = <R>(
  fn: <A>(a: A) => (b: A) => R,
) => <A>(b: A) => (a: A) => R

/** first parameterized, second concrete */
export type FlipC_PC = <Fixed, R>(
  fn: <A>(a: A) => (b: Fixed) => R,
) => (b: Fixed) => <A>(a: A) => R

/** first concrete, second parameterized */
export type FlipC_CP = <Fixed, R>(
  fn: (a: Fixed) => <B>(b: B) => R,
) => <B>(b: B) => (a: Fixed) => R

export type FlipCMultivariate = FlipC_MpMp &
  FlipC_MpS &
  FlipC_MpC &
  FlipC_CMp &
  FlipC_CC
export type FlipCUnary = FlipC_PP & FlipC_PS & FlipC_PC & FlipC_CP & FlipC_CC
/**
 * Type of a function that flips functions in the form `A -> B -> R` to `B -> A -> R`
 *
 * Handles most parameterized unary functions,
 * and parameterized multivariate functions,
 * however some information is lost for multivariate functions (returned function takes ...any[]),
 * and higher kinded types do not work at all
 *
 * E.g this function will not handle these cases:
 * 1. A function taking an array of A (higher kinded type):
 *  ```ts
 *    type Fn = <A>(x: A[]) => (y: number) => boolean
 *  ```
 * 2. A function taking a parameterized function (higher kinded type)
 *  ```ts
 *    type Fn = (x: string[]) => <B>(fn: (x: string) => B) => B
 *  ```
 * 3. A multivariate type that does not extend any[] (we need variadic kinds for this to work)
 * ```ts
 *    type Fn = <As extends [string, ...string[]]>(...as: As) => (b: number) => boolean
 * ```
 */
export type FlipC = (FlipC_MpMp & FlipC_PP) &
  (FlipC_MpS & FlipC_PS) &
  (FlipC_MpC & FlipC_PC) &
  (FlipC_CMp & FlipC_CP) &
  FlipC_CC

/**
 * A function that converts functions from the form `A -> B -> R` to `B -> A -> R`
 *
 * Handles most parameterized unary functions,
 * and parameterized multivariate functions,
 * however some information is lost for multivariate functions (returned function takes ...any[]),
 * and higher kinded types do not work at all
 *
 * E.g this function will not handle these cases:
 * 1. A function taking an array of A (higher kinded type):
 *  ```ts
 *    type Fn = <A>(x: A[]) => (y: number) => boolean
 *  ```
 * 2. A function taking a parameterized function (higher kinded type)
 *  ```ts
 *    type Fn = (x: string[]) => <B>(fn: (x: string) => B) => B
 *  ```
 * 3. A multivariate type that does not extend any[] (we need variadic kinds for this to work)
 * ```ts
 *    type Fn = <As extends [string, ...string[]]>(...as: As) => (b: number) => boolean
 * ```
 */
export const flipC: FlipC = <F1 extends any[], F2 extends any[], R>(
  fn: (...as: F1) => (...bs: F2) => R,
) => (...bs: F2) => (...as: F1) => fn(...as)(...bs)

// // Tests for the flipC function. Verify
// // that the inferred return type matches the comment
// /** both concrete */
// declare function fn1(a: number): (b: string) => boolean
// /** first parameterized, second concrete */
// declare function fn2<A>(a: A): (b: string) => boolean
// /** first concrete, second parameterized */
// declare function fn3(a: number): <B>(b: B) => boolean
// /** first parameterized, second same */
// declare function fn4<A>(a: A): (b: A) => boolean
// /** both parameterized */
// declare function fn5<A>(a: A): <B>(b: B) => boolean
// flipC(fn1) // Returns: string -> number -> boolean
// flipC(fn2) // Returns: string -> A -> boolean
// flipC(fn3) // Returns: B -> number -> boolean
// flipC(fn4) // Returns: A -> A -> boolean
// flipC(fn5) // Returns: B -> A -> boolean

// /** both concrete */
// declare function fn6(...a: number[]): (...b: string[]) => boolean
// /** first multivariate-parameterized, second concrete */
// declare function fn7<As extends any[]>(...a: As): (...b: string[]) => boolean
// /** first concrete, second multivariate-parameterized */
// declare function fn8(...a: string[]): <Bs extends any[]>(...b: Bs) => boolean
// /** first concrete, second same */
// declare function fn9<As extends any[]>(...a: As): (...b: As) => boolean
// /** both multivariate-parameterized */
// declare function fn10<As extends any[]>(
//   ...as: As
// ): <Bs extends any[]>(...bs: Bs) => boolean
// flipC(fn6) // Returns: ...string[] -> ...number[] -> boolean
// flipC(fn7) // Returns: ...string[] -> ...As -> boolean
// flipC(fn8) // Returns: ...Bs -> ...string[] -> boolean
// flipC(fn9) // Returns: ...As -> ...As -> boolean
// flipC(fn10) // Returns: ...Bs -> ...As -> boolean

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
  Tests for the flip function
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

export type ComposeFn2 = <As extends any[], B, C>(
  bc: Fn<[B], C>,
  ab: Fn<As, B>,
) => Fn<As, C>
export type ComposeFn3 = <As extends any[], B, C, D>(
  cd: Fn<[C], D>,
  bc: Fn<[B], C>,
  ab: Fn<As, B>,
) => Fn<As, D>
export type ComposeFn4 = <As extends any[], B, C, D, E>(
  de: Fn<[D], E>,
  cd: Fn<[C], D>,
  bc: Fn<[B], C>,
  ab: Fn<As, B>,
) => Fn<As, E>
export type ComposeFn5 = <As extends any[], B, C, D, E, F>(
  ef: Fn<[E], F>,
  de: Fn<[D], E>,
  cd: Fn<[C], D>,
  bc: Fn<[B], C>,
  ab: Fn<As, B>,
) => Fn<As, F>
export type ComposeFn6 = <As extends any[], B, C, D, E, F, G>(
  fg: Fn<[F], G>,
  ef: Fn<[E], F>,
  de: Fn<[D], E>,
  cd: Fn<[C], D>,
  bc: Fn<[B], C>,
  ab: Fn<As, B>,
) => Fn<As, G>
export type ComposeFn7 = <As extends any[], B, C, D, E, F, G, H>(
  gh: Fn<[G], H>,
  fg: Fn<[F], G>,
  ef: Fn<[E], F>,
  de: Fn<[D], E>,
  cd: Fn<[C], D>,
  bc: Fn<[B], C>,
  ab: Fn<As, B>,
) => Fn<As, H>
export type ComposeFn8 = <As extends any[], B, C, D, E, F, G, H, I>(
  hi: Fn<[H], I>,
  gh: Fn<[G], H>,
  fg: Fn<[F], G>,
  ef: Fn<[E], F>,
  de: Fn<[D], E>,
  cd: Fn<[C], D>,
  bc: Fn<[B], C>,
  ab: Fn<As, B>,
) => Fn<As, I>
export type ComposeFn9 = <As extends any[], B, C, D, E, F, G, H, I, J>(
  ij: Fn<[I], J>,
  hi: Fn<[H], I>,
  gh: Fn<[G], H>,
  fg: Fn<[F], G>,
  ef: Fn<[E], F>,
  de: Fn<[D], E>,
  cd: Fn<[C], D>,
  bc: Fn<[B], C>,
  ab: Fn<As, B>,
) => Fn<As, J>
export type ComposeFn = ComposeFn2 &
  ComposeFn3 &
  ComposeFn4 &
  ComposeFn5 &
  ComposeFn6 &
  ComposeFn7 &
  ComposeFn8 &
  ComposeFn9

export const compose: ComposeFn = (
  // tslint:disable-next-line:ban-types
  ...fns: [Function, Function, ...Function[]]
) => {
  const len = fns.length - 1
  return function(this: any, ...args: any[]) {
    let y = args
    for (let i = len; i > -1; i--) {
      y = [fns[i].call(this, ...y)]
    }
    return y[0]
  }
}

export type PipeFn2 = <As extends any[], B, C>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
) => Fn<As, C>
export type PipeFn3 = <As extends any[], B, C, D>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
) => Fn<As, D>
export type PipeFn4 = <As extends any[], B, C, D, E>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
) => Fn<As, E>
export type PipeFn5 = <As extends any[], B, C, D, E, F>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
  ef: Fn<[E], F>,
) => Fn<As, F>
export type PipeFn6 = <As extends any[], B, C, D, E, F, G>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
  ef: Fn<[E], F>,
  fg: Fn<[F], G>,
) => Fn<As, G>
export type PipeFn7 = <As extends any[], B, C, D, E, F, G, H>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
  ef: Fn<[E], F>,
  fg: Fn<[F], G>,
  gh: Fn<[G], H>,
) => Fn<As, H>
export type PipeFn8 = <As extends any[], B, C, D, E, F, G, H, I>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
  ef: Fn<[E], F>,
  fg: Fn<[F], G>,
  gh: Fn<[G], H>,
  hi: Fn<[H], I>,
) => Fn<As, I>
export type PipeFn9 = <As extends any[], B, C, D, E, F, G, H, I, J>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
  ef: Fn<[E], F>,
  fg: Fn<[F], G>,
  gh: Fn<[G], H>,
  hi: Fn<[H], I>,
  ij: Fn<[I], J>,
) => Fn<As, J>
// tslint:disable:ban-types
export type PipeFnUntyped = <As extends any[]>(
  ...fns: [(...args: As) => any, ...Array<(arg: any) => any>]
) => (...args: As) => any
// tslint:enable:ban-types
export type PipeFn = PipeFn2 &
  PipeFn3 &
  PipeFn4 &
  PipeFn5 &
  PipeFn6 &
  PipeFn7 &
  PipeFn8 &
  PipeFn9 &
  PipeFnUntyped

// tslint:disable-next-line:ban-types
export const pipe: PipeFn = (...fns: [Function, ...Function[]]) => {
  const len = fns.length - 1
  return function(this: any, ...args: any[]) {
    let y = args
    for (let i = 0; i <= len; i++) {
      y = [fns[i].call(this, ...y)]
    }
    return y[0]
  }
}

export type PipeA1<As extends any[]> = <B>(ab: Fn<As, B>) => B
export type PipeA2<As extends any[]> = <B, C>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
) => C
export type PipeA3<As extends any[]> = <B, C, D>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
) => D
export type PipeA4<As extends any[]> = <B, C, D, E>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
) => E
export type PipeA5<As extends any[]> = <B, C, D, E, F>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
  ef: Fn<[E], F>,
) => F
export type PipeA6<As extends any[]> = <B, C, D, E, F, G>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
  ef: Fn<[E], F>,
  fg: Fn<[F], G>,
) => G
export type PipeA7<As extends any[]> = <B, C, D, E, F, G, H>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
  ef: Fn<[E], F>,
  fg: Fn<[F], G>,
  gh: Fn<[G], H>,
) => H
export type PipeA8<As extends any[]> = <B, C, D, E, F, G, H, I>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
  ef: Fn<[E], F>,
  fg: Fn<[F], G>,
  gh: Fn<[G], H>,
  hi: Fn<[H], I>,
) => I
export type PipeA9<As extends any[]> = <B, C, D, E, F, G, H, I, J>(
  ab: Fn<As, B>,
  bc: Fn<[B], C>,
  cd: Fn<[C], D>,
  de: Fn<[D], E>,
  ef: Fn<[E], F>,
  fg: Fn<[F], G>,
  gh: Fn<[G], H>,
  hi: Fn<[H], I>,
  ij: Fn<[I], J>,
) => J
// tslint:disable-next-line:ban-types
export type PipeAUntyped<As extends any[]> = (
  ...fns: [(...args: As) => any, ...Array<(arg: any) => any>]
) => any

export type PipeApplied<As extends any[]> = PipeA1<As> &
  PipeA2<As> &
  PipeA3<As> &
  PipeA4<As> &
  PipeA5<As> &
  PipeA6<As> &
  PipeA7<As> &
  PipeA8<As> &
  PipeA9<As> &
  PipeAUntyped<As>

export const pipeline: <As extends any[]>(
  ...args: As
) => PipeApplied<As> = flipC(pipe) as PipeApplied<any>
