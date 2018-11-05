import { Functor, Functor1 } from './Functor'
import { HKT, Type, URIS } from '../HKT'

export interface Apply<F> extends Functor<F> {
  readonly ap: <A, B>(fab: HKT<F, (a: A) => B>, fa: HKT<F, A>) => HKT<F, B>
}

export interface Apply1<F extends URIS> extends Functor1<F> {
  readonly ap: <A, B>(fab: Type<F, (a: A) => B>, fa: Type<F, A>) => Type<F, B>
}
