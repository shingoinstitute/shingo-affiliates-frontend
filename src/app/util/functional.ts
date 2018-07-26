export type Function1<A, B> = (a: A) => B;
export type Function2<A, B, C> = (a: A, b: B) => C;
export type Function3<A, B, C, D> = (a: A, b: B, c: C) => D;
export type Function4<A, B, C, D, E> = (a: A, b: B, c: C, d: D) => E;
export type Function5<A, B, C, D, E, F> = (a: A, b: B, c: C, d: D, e: E) => F;
export type Function6<A, B, C, D, E, F, G> = (a: A, b: B, c: C, d: D, e: E, f: F) => G;
export type Function7<A, B, C, D, E, F, G, H> = (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H;
export type Function8<A, B, C, D, E, F, G, H, I> = (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I;
export type Function9<A, B, C, D, E, F, G, H, I, J> = (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => J;

export function compose<A, B, C>(bc: Function1<B, C>, ab: Function1<A, B>): Function1<A, C>;
export function compose<A, B, C, D>(cd: Function1<C, D>, bc: Function1<B, C>, ab: Function1<A, B>): Function1<A, D>;
export function compose<A, B, C, D, E>(de: Function1<D, E>, cd: Function1<C, D>, bc: Function1<B, C>, ab: Function1<A, B>): Function1<A, E>;
export function compose<A, B, C, D, E, F>(
  ef: Function1<E, F>,
  de: Function1<D, E>,
  cd: Function1<C, D>,
  bc: Function1<B, C>,
  ab: Function1<A, B>
): Function1<A, F>;
export function compose<A, B, C, D, E, F, G>(
  fg: Function1<F, G>,
  ef: Function1<E, F>,
  de: Function1<D, E>,
  cd: Function1<C, D>,
  bc: Function1<B, C>,
  ab: Function1<A, B>
): Function1<A, G>;
export function compose<A, B, C, D, E, F, G, H>(
  gh: Function1<G, H>,
  fg: Function1<F, G>,
  ef: Function1<E, F>,
  de: Function1<D, E>,
  cd: Function1<C, D>,
  bc: Function1<B, C>,
  ab: Function1<A, B>
): Function1<A, H>;
export function compose<A, B, C, D, E, F, G, H, I>(
  hi: Function1<H, I>,
  gh: Function1<G, H>,
  fg: Function1<F, G>,
  ef: Function1<E, F>,
  de: Function1<D, E>,
  cd: Function1<C, D>,
  bc: Function1<B, C>,
  ab: Function1<A, B>
): Function1<A, I>;
export function compose<A, B, C, D, E, F, G, H, I, J>(
  ij: Function1<I, J>,
  hi: Function1<H, I>,
  gh: Function1<G, H>,
  fg: Function1<F, G>,
  ef: Function1<E, F>,
  de: Function1<D, E>,
  cd: Function1<C, D>,
  bc: Function1<B, C>,
  ab: Function1<A, B>
): Function1<A, J>;
export function compose(...fns: Function[]) {
  return (...args: any[]) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];
}
