import { HKT, URIS, Type } from '../HKT'

export interface Foldable<F> {
  readonly URI: F
  readonly reduce: <A, B>(fa: HKT<F, A>, b: B, f: (b: B, a: A) => B) => B
  readonly reduceC: <A, B>(
    f: (b: B, a: A) => B,
  ) => (b: B) => (fa: HKT<F, A>) => B
}

export interface Foldable1<F extends URIS> {
  readonly URI: F
  readonly reduce: <A, B>(fa: Type<F, A>, b: B, f: (b: B, a: A) => B) => B
  readonly reduceC: <A, B>(
    f: (b: B, a: A) => B,
  ) => (b: B) => (fa: Type<F, A>) => B
}
