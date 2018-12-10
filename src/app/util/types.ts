export type Fn<Args extends any[], R> = (...args: Args) => R
export type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never
export type ArgsOf<T> = T extends (...args: infer A) => any ? A : never
export type UnPromise<T> = T extends Promise<infer I> ? I : never
export type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never

/**
 * The keys used to index a tuple `T`
 */
export type IndexKeys<T extends any[]> = Exclude<keyof T, keyof any[]>

export type OmitNever<O> = Pick<
  O,
  { [k in keyof O]: O[k] extends never ? never : k }[keyof O]
>

/**
 * A shorthand to make homogeneous object types.
 *
 * from tycho01/typical
 */
export interface Obj<T> {
  [k: string]: T
}

/**
 * A string boolean that can be used as an index type
 *
 * from tycho01/typical
 */
export type SBool = '0' | '1'

/**
 * Logical `AND`, `&&` equivalent for string bools.
 *
 * from tycho01/typical
 */
export type And<A extends SBool, B extends SBool> = ({
  1: { 1: '1' } & Obj<'0'>
} & Obj<Obj<'0'>>)[A][B]

/**
 * Check if a type matches another (`<=`).
 *
 * from tycho01/typical
 */
export type Matches<V, T> = V extends T ? '1' : '0'

/**
 * Check if two types are equal (`==`), i.e. match both ways.
 *
 * from tycho01/typical
 */
export type TypesEqual<A, B> = And<Matches<A, B>, Matches<B, A>>

/**
 * The keys of an object `O` whose value types exactly equal equal the given type `T`
 *
 * @example
 * ```ts
 * KeysOfType<{ x: string, y: number | string }, string | number> -> 'y'
 * ```
 */
export type KeysOfType<O, T> = {
  [k in keyof O]-?: TypesEqual<O[k], T> extends '1' ? k : never
}[keyof O]

/**
 * The keys of an object `O` whose value types match ('>=') the given type `T`
 *
 * @example
 * ```ts
 * KeysOfType2<{ x: string, y: number, z: string | number | boolean }, string | number> -> 'z'
 * KeysOfType2<{ x: string, y: number, z: boolean }, string | number> -> never
 * ```
 */
export type KeysOfType2<O, T> = {
  [k in keyof O]-?: [T] extends [O[k]] ? k : never
}[keyof O]

/**
 * The keys of an object `O` whose value types match ('<=') the given type `T`
 *
 * @example
 * ```ts
 * KeysOfType1<{ x: string, y: number, z: string | number | boolean }, string | number> -> 'x' | 'y'
 * KeysOfType1<{ x: string, y: number, z: boolean }, string | number> -> 'x' | 'y'
 * ```
 */
export type KeysOfType1<O, T> = {
  [k in keyof O]-?: [O[k]] extends [T] ? k : never
}[keyof O]

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type MakeKeysOptional<O, K extends keyof O> = Overwrite<
  O,
  { [k in K]+?: O[k] }
>

export type OptionalKeys<T> = KeysOfType2<T, undefined>
export type NullKeys<T> = KeysOfType2<T, null>
export type MaybeKeys<T> = KeysOfType2<T, null | undefined>

export type MakeMaybe<T> = { [K in keyof T]+?: T[K] | null | undefined }
export type Overwrite<A, B> = Pick<A, Exclude<keyof A, keyof B>> & B

export type UndefinedToOptional<T> = MakeKeysOptional<T, OptionalKeys<T>>

export type RequireKeys<T, K extends keyof T> = Overwrite<
  T,
  { [key in K]-?: T[key] }
>
