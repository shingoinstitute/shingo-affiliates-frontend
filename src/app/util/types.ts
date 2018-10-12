import { AuthController } from '@shingo/affiliates-api/controllers/auth/auth.controller'
import {
  RouteMetadata,
  Refined,
  RouteMetadataKey,
  RouteMetadataData,
  BodyKey,
} from '@shingo/affiliates-api/util'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type Overwrite<A extends object, B extends object> = Pick<
  A,
  Exclude<keyof A, keyof B>
> &
  B

export type RequireKeys<T extends object, K extends keyof T> = Overwrite<
  T,
  { [key in K]-?: T[key] }
>

export type OptionalKeys<T extends object, K extends keyof T> = Overwrite<
  T,
  { [key in K]+?: T[key] }
>

export type The<T, V extends T> = V
export type Matches<V, T> = V extends T ? '1' : '0'
type NonMethodKeys<T, K extends keyof T = keyof T> = T[K] extends (
  ...args: any
) => any
  ? never
  : K

export type MethodKeys<T> = Exclude<keyof T, NonMethodKeys<T, keyof T>>

type ArgsOf<T> = T extends (...args: infer A) => any ? A : never
type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never

type GetMetadata<T> = T extends (infer U)[]
  ? (U extends Refined<any, RouteMetadataKey> ? RouteMetadataData<U> : never)
  : never

type GetRefineBaseType<T, K> = T extends Refined<infer U, K> ? U : never

type GetBody<T> = T extends (infer U)[]
  ? (U extends Refined<any, BodyKey> ? GetRefineBaseType<U, BodyKey> : never)
  : never

type UnPromise<T> = T extends Promise<infer V> ? V : never
type GetAuth<T> = T extends { auth: string[] | boolean } ? T['auth'] : never
type RequiresAuth<T> = T extends true | string[] ? true : false

export type MethodType<
  T,
  M extends keyof T,
  Ps = ArgsOf<T[M]>,
  R = ReturnOf<T[M]>,
  Mt = GetMetadata<Ps>,
  Auth = GetAuth<Mt>,
  ReqAuth = RequiresAuth<Auth>
> = T[M] extends (...args: any[]) => any
  ? {
      parameters: Ps
      originalReturntype: R
      returntype: UnPromise<R>
      metadata: Mt
      body: GetBody<Ps>
      requiresAuth: ReqAuth
      reqRoles: Auth extends string[] ? Auth : never
    }
  : never

export type ApiContract<T> = { [k in MethodKeys<T>]: MethodType<T, k> }
type T1 = ApiContract<AuthController>['loginAs']['reqRoles']
