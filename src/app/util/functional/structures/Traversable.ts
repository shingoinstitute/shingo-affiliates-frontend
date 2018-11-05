import { Functor, Functor1 } from './Functor'
import { Foldable, Foldable1 } from './Foldable'
import { HKT, Type, URIS } from '../HKT'
import { Applicative1, Applicative } from './Applicative'

export interface Traversable<T> extends Functor<T>, Foldable<T> {
  readonly traverse: Traverse<T>
}

export interface Traversable1<T extends URIS>
  extends Functor1<T>,
    Foldable1<T> {
  readonly traverse: Traverse1<T>
}

export interface Traverse<T> {
  <F extends URIS>(F: Applicative1<F>): <A, B>(
    ta: HKT<T, A>,
    f: (a: A) => Type<F, B>,
  ) => Type<F, HKT<T, B>>
  <F>(F: Applicative<F>): <A, B>(
    ta: HKT<T, A>,
    f: (a: A) => HKT<F, B>,
  ) => HKT<F, HKT<T, B>>
}

export interface Traverse1<T extends URIS> {
  <F extends URIS>(F: Applicative1<F>): <A, B>(
    ta: Type<T, A>,
    f: (a: A) => Type<F, B>,
  ) => Type<F, Type<T, B>>
  <F>(F: Applicative<F>): <A, B>(
    ta: Type<T, A>,
    f: (a: A) => HKT<F, B>,
  ) => HKT<F, Type<T, B>>
}

export interface Sequence<T> {
  <F extends URIS>(F: Applicative1<F>): <A>(
    ta: HKT<T, Type<F, A>>,
  ) => Type<F, HKT<T, A>>
  <F>(F: Applicative<F>): <A>(ta: HKT<T, HKT<F, A>>) => HKT<F, HKT<T, A>>
}

export interface Sequence1<T extends URIS> {
  <F extends URIS>(F: Applicative1<F>): <A>(
    ta: Type<T, Type<F, A>>,
  ) => Type<F, Type<T, A>>
  <F>(F: Applicative<F>): <A>(ta: Type<T, HKT<F, A>>) => HKT<F, Type<T, A>>
}
