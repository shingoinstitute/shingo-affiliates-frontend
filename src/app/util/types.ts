export type Fn<Args extends any[], R> = (...args: Args) => R
export type Refinement<A, B extends A> = (a: A) => a is B
export type Predicate<A> = Fn<[A], boolean>
export interface Semigroup<A> {
  readonly concat: Fn<[A, A], A>
}
export interface Monoid<A> extends Semigroup<A> {
  readonly empty: A
}

/** A map where every key is also it's value */
export type KVMap<Entries extends string> = { readonly [K in Entries]: K }
