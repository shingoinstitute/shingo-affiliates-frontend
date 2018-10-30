export type Nothing = [false, undefined]
export type Just<A> = [true, A]
export type Maybe<A> = Nothing | Just<A>

export const nothing: Nothing = [false, undefined]
export const just = <A>(a: A): Just<A> => [true, a]
export const isNothing = <A>(m: Maybe<A>): m is Nothing =>
  m.length === 2 && !m[0]
export const isJust = <A>(m: Maybe<A>): m is Just<A> => m.length === 2 && m[0]

export const map = <A, B>(maybe: Maybe<A>, fn: ((v: A) => B)) =>
  isJust(maybe) ? just(fn(maybe[1])) : maybe

export const mapC = <A, B>(fn: ((v: A) => B)) => (maybe: Maybe<A>): Maybe<B> =>
  map(maybe, fn)

export const chain = <A, B>(maybe: Maybe<A>, fn: ((v: A) => Maybe<B>)) =>
  isJust(maybe) ? fn(maybe[1]) : maybe

export const chainC = <A, B>(fn: ((v: A) => Maybe<B>)) => (
  maybe: Maybe<A>,
): Maybe<B> => chain(maybe, fn)

export const justs = <A>(ms: Array<Maybe<A>>) => ms.filter(isJust)
