export type Function1<A, B> = (a: A) => B
export type Function2<A, B, C> = (a: A, b: B) => C
export type Function3<A, B, C, D> = (a: A, b: B, c: C) => D
export type Function4<A, B, C, D, E> = (a: A, b: B, c: C, d: D) => E
export type Function5<A, B, C, D, E, F> = (a: A, b: B, c: C, d: D, e: E) => F
export type Function6<A, B, C, D, E, F, G> = (
  a: A,
  b: B,
  c: C,
  d: D,
  e: E,
  f: F,
) => G
export type Function7<A, B, C, D, E, F, G, H> = (
  a: A,
  b: B,
  c: C,
  d: D,
  e: E,
  f: F,
  g: G,
) => H
export type Function8<A, B, C, D, E, F, G, H, I> = (
  a: A,
  b: B,
  c: C,
  d: D,
  e: E,
  f: F,
  g: G,
  h: H,
) => I
export type Function9<A, B, C, D, E, F, G, H, I, J> = (
  a: A,
  b: B,
  c: C,
  d: D,
  e: E,
  f: F,
  g: G,
  h: H,
  i: I,
) => J

export type Curried2<A, B, C> = (a: A) => (b: B) => C
export type Curried3<A, B, C, D> = (a: A) => (b: B) => (c: C) => D
export type Curried4<A, B, C, D, E> = (a: A) => (b: B) => (c: C) => (d: D) => E
export type Curried5<A, B, C, D, E, F> = (
  a: A,
) => (b: B) => (c: C) => (d: D) => (e: E) => F
export type Curried6<A, B, C, D, E, F, G> = (
  a: A,
) => (b: B) => (c: C) => (d: D) => (e: E) => (f: F) => G
export type Curried7<A, B, C, D, E, F, G, H> = (
  a: A,
) => (b: B) => (c: C) => (d: D) => (e: E) => (f: F) => (g: G) => H
export type Curried8<A, B, C, D, E, F, G, H, I> = (
  a: A,
) => (b: B) => (c: C) => (d: D) => (e: E) => (f: F) => (g: G) => (h: H) => I
export type Curried9<A, B, C, D, E, F, G, H, I, J> = (
  a: A,
) => (
  b: B,
) => (c: C) => (d: D) => (e: E) => (f: F) => (g: G) => (h: H) => (i: I) => J

export type Lazy<A> = () => A

export type Matches<V, T> = V extends T ? '1' : '0'
/**
 * Asserts that V extends T
 */
export type The<T, V extends T> = V
/**
 * function version of `The`, useful to test types at compile time
 */
export const the = <T, V extends T>() => '1'
