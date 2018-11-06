import { the } from './types'
import { Applicative, Applicative1 } from './structures/Applicative'
import { HKT } from './HKT'
import { Functor1 } from './structures/Functor'
import { Foldable1 } from './structures/Foldable'
import { Traversable1, Sequence1, Traverse1 } from './structures/Traversable'

// tslint:disable:max-classes-per-file
// export type Nothing = [false, undefined]
// export type Just<A> = [true, A]
// export type Maybe<A> = Nothing | Just<A>
declare module './HKT' {
  interface URI2HKT<A> {
    Maybe: Maybe<A>
  }
}

export const URI = 'Maybe'
export type URI = typeof URI
export interface MaybeBase<A> {
  match<B>(m: { Just: (a: A) => B; Nothing: () => B }): B
  isJust(): boolean
  isNothing(): boolean
}

export type Maybe<A> = Nothing | Just<A>
export type MaybeValue<M> = M extends Maybe<infer A> ? A : never
export type ToMaybeBase<M extends Maybe<any>> = MaybeBase<MaybeValue<M>>

export class Nothing implements MaybeBase<never> {
  readonly _URI!: URI
  readonly _A!: never

  match<B>(m: { Just: (a: never) => B; Nothing: () => B }): B {
    return m.Nothing()
  }
  isJust(): boolean {
    return false
  }
  isNothing(): boolean {
    return true
  }
}

export class Just<A> implements MaybeBase<A> {
  readonly _URI!: URI
  readonly _A!: A
  constructor(readonly value: A) {}

  match<B>(m: { Just: (a: A) => B; Nothing: () => B }) {
    return m.Just(this.value)
  }

  isJust(): boolean {
    return true
  }
  isNothing(): boolean {
    return false
  }
}

export const nothing: Maybe<never> = new Nothing()
export const just = <A>(a: A): Maybe<A> => new Just(a)
export const isNothing = <A>(m: Maybe<A>): m is Nothing => m.isNothing()

export const isJust = <A>(m: Maybe<A>): m is Just<A> => m.isJust()

export const map = <A, B>(maybe: Maybe<A>, fn: ((v: A) => B)): Maybe<B> =>
  isJust(maybe) ? just(fn(maybe.value)) : maybe

export const mapC = <A, B>(fn: ((v: A) => B)) => (maybe: Maybe<A>): Maybe<B> =>
  map(maybe, fn)

export const reduce = <A, B>(maybe: Maybe<A>, b: B, fn: (b: B, a: A) => B) =>
  isJust(maybe) ? fn(b, maybe.value) : b

export const reduceC = <A, B>(fn: (b: B, a: A) => B) => (b: B) => (
  maybe: Maybe<A>,
) => reduce(maybe, b, fn)

export const of = <A>(a: A): Maybe<A> => new Just(a)
export const ap = <A, B>(fab: Maybe<(a: A) => B>, fa: Maybe<A>): Maybe<B> =>
  isJust(fa) && isJust(fab) ? new Just(fab.value(fa.value)) : nothing

export const traverse: Traverse1<URI> = <F>(F: Applicative<F>) => <A, B>(
  ta: Maybe<A>,
  f: (a: A) => HKT<F, B>,
): HKT<F, Maybe<B>> => (isJust(ta) ? F.map(f(ta.value), just) : F.of(nothing))

export const sequence: Sequence1<URI> = <F>(F: Applicative<F>) => <A>(
  ta: Maybe<HKT<F, A>>,
): HKT<F, Maybe<A>> => (isJust(ta) ? F.map(ta.value, just) : F.of(nothing))

export const chain = <A, B>(
  maybe: Maybe<A>,
  fn: ((v: A) => Maybe<B>),
): Maybe<B> => (isJust(maybe) ? fn(maybe.value) : maybe)

export const chainC = <A, B>(fn: ((v: A) => Maybe<B>)) => (
  maybe: Maybe<A>,
): Maybe<B> => chain(maybe, fn)

export const justs = <A>(ms: Array<Maybe<A>>) => ms.filter(isJust)

export const match = <A, B>(
  m: Maybe<A>,
  fns: {
    Just: (a: A) => B
    Nothing: () => B
  },
) => (m as MaybeBase<A>).match(fns)

export const matchC = <A, B>(fns: { Just: (a: A) => B; Nothing: () => B }) => (
  m: Maybe<A>,
) => match(m, fns)

// Sanity checks for the module
import * as module from './Maybe'

the<Functor1<URI>, typeof module>()
the<Foldable1<URI>, typeof module>()
the<Applicative1<URI>, typeof module>()
the<Traversable1<URI>, typeof module>()
