import { HKT, Type, URIS } from '../HKT'

export interface Functor<F> {
  readonly URI: F
  readonly map: <A, B>(fa: HKT<F, A>, f: (a: A) => B) => HKT<F, B>
  readonly mapC: <A, B>(f: (a: A) => B) => (fa: HKT<F, A>) => HKT<F, B>
}

export interface Functor1<F extends URIS> {
  readonly URI: F
  readonly map: <A, B>(fa: Type<F, A>, f: (a: A) => B) => Type<F, B>
  readonly mapC: <A, B>(f: (a: A) => B) => (fa: Type<F, A>) => Type<F, B>
}

export function lift<F extends URIS>(
  F: Functor1<F>,
): <A, B>(f: (a: A) => B) => (fa: Type<F, A>) => Type<F, B>
export function lift<F>(
  F: Functor<F>,
): <A, B>(f: (a: A) => B) => (fa: HKT<F, A>) => HKT<F, B>
export function lift<F>(
  F: Functor<F>,
): <A, B>(f: (a: A) => B) => (fa: HKT<F, A>) => HKT<F, B> {
  return f => fa => F.map(fa, f)
}

export { lift as mapC }

export function map<F extends URIS>(
  F: Functor1<F>,
): <A, B>(fa: Type<F, A>, f: (a: A) => B) => Type<F, B>
export function map<F>(
  F: Functor<F>,
): <A, B>(fa: HKT<F, A>, f: (a: A) => B) => HKT<F, B>
export function map<F>(
  F: Functor<F>,
): <A, B>(fa: HKT<F, A>, f: (a: A) => B) => HKT<F, B> {
  return (fa, f) => F.map(fa, f)
}
