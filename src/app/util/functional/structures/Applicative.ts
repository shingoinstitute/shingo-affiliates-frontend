import { Apply, Apply1 } from './Apply'
import { HKT, URIS, Type } from '../HKT'

export interface Applicative<F> extends Apply<F> {
  readonly of: <A>(a: A) => HKT<F, A>
}

export interface Applicative1<F extends URIS> extends Apply1<F> {
  readonly of: <A>(a: A) => Type<F, A>
}
