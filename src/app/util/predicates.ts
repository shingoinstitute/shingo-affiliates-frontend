import { Refinement, or } from './functional'
import { UnionToIntersection } from './types'

export type TypeName =
  | 'undefined'
  | 'object'
  | 'boolean'
  | 'number'
  | 'string'
  | 'symbol'
  | 'function'
  | 'bigint'

export type TypeFromName<
  T extends TypeName
> = T extends 'undefined'  ? undefined // prettier-ignore
  : T extends 'object'   ? object | null // prettier-ignore
  : T extends 'boolean'  ? boolean // prettier-ignore
  : T extends 'number'   ? number // prettier-ignore
  : T extends 'string'   ? string // prettier-ignore
  : T extends 'symbol'   ? symbol // prettier-ignore
  // tslint:disable-next-line: ban-types
  : T extends 'function' ? Function // prettier-ignore
  // not supported in ts 3.1
  : T extends 'bigint'   ? never // prettier-ignore
  : never // prettier-ignore

export const typeOf = <Ts extends [TypeName, ...TypeName[]]>(...types: Ts) => (
  v: any,
): v is TypeFromName<Ts[number]> => types.includes(typeof v)

type InstanceOfFn<Ts extends any> = ((
  x: any,
  conj: true,
) => x is UnionToIntersection<Ts[number]>) &
  ((x: any, conj?: boolean) => x is Ts[number])

/**
 * Function version of an `instanceof` check
 * @param constructors constructor functions to test against
 * @param x the value to test
 * @param conj should x be an instance of every constructor, or just some
 */
export const instanceOf = <Ts extends any[]>(
  ...constructors: { [t in keyof Ts]: new (...args: any) => Ts[t] }
): InstanceOfFn<Ts> => (x: any, conj = false): x is Ts[number] =>
  conj
    ? constructors.every(c => x instanceof c)
    : constructors.some(c => x instanceof c)

export const isTruthy = <T>(
  v: T,
): v is Exclude<T, null | undefined | false | 0 | ''> => !!v

export const isNull = (x: any): x is null => x === null

export const isUndefined = typeOf('undefined')
export const isMaybeValue = or(typeOf('undefined'), isNull)

export const optional = <A, B extends A>(pred: Refinement<A, B>) =>
  or(isUndefined, pred)
export const nullable = <A, B extends A>(pred: Refinement<A, B>) =>
  or(isNull, pred)
export const maybeable = <A, B extends A>(pred: Refinement<A, B>) =>
  or(isMaybeValue, pred)

export const literal = <T extends string | number | boolean>(expected: T) => (
  x: any,
): x is T => x === expected
