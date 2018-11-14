import {
  Refined,
  RouteMetadataKey,
  RouteMetadataData,
  BodyKey,
  UrlParamKey,
  RefinedExtra,
  FileKey,
  FilesExtraBase,
  ParamKey,
  RefineBaseType,
  RefineTag,
} from '@shingo/affiliates-api/util'

declare global {
  namespace Express {
    namespace Multer {
      // tslint:disable-next-line:no-empty-interface
      interface File {}
    }
  }
}

type NonMethodKeys<T, K extends keyof T = keyof T> = T[K] extends (
  ...args: any
) => any
  ? never
  : K

export type MethodKeys<T> = Exclude<keyof T, NonMethodKeys<T, keyof T>>

export type ArgsOf<T> = T extends (...args: infer A) => any ? A : never
export type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never
export type RefinedOf<T, K extends string> = T extends Refined<any, K>
  ? T[typeof RefineTag] extends K ? true : false
  : false
export type IndexKeys<T extends any[]> = Exclude<keyof T, keyof any[]>

type GetMetadataItem<T> = RefinedOf<T, RouteMetadataKey> extends true
  ? RouteMetadataData<T>
  : never
type GetMetadata<T> = T extends any[]
  ? { [k in IndexKeys<T>]: GetMetadataItem<T[k]> }[IndexKeys<T>]
  : never

type GetBodyItem<T> = RefinedOf<T, BodyKey> extends true
  ? RefineBaseType<T, BodyKey>
  : never
type GetBody<T> = T extends any[]
  ? { [k in IndexKeys<T>]: GetBodyItem<T[k]> }[IndexKeys<T>]
  : never

type GetUrlParam<T> = RefinedOf<T, UrlParamKey> extends true
  ? RefinedExtra<T, UrlParamKey>
  : never
type GetUrlParamsKeys<T> = T extends any[]
  ? { [k in IndexKeys<T>]: GetUrlParam<T[k]> }[IndexKeys<T>]
  : never
type GetUrlParams<T, Keys = GetUrlParamsKeys<T>> = [Keys] extends [string]
  ? [Keys] extends [never] ? never : Record<Keys, string>
  : never

type GetFileData<T, E = RefinedExtra<T, FileKey>> = RefinedOf<
  T,
  FileKey
> extends true
  ? E extends FilesExtraBase
    ? { [k in E['name']]: E['max'] extends 1 ? [File] : File[] }
    : never
  : never
type GetFileDataUnion<T> = T extends any[]
  ? { [k in IndexKeys<T>]: GetFileData<T[k]> }[IndexKeys<T>]
  : never
type GetFiles<
  T,
  DataTp = GetFileDataUnion<T>,
  Files = UnionToIntersection<DataTp>
> = Files extends { [k: string]: File[] } ? Files : never

type CreateParamInfo<E> = E extends { query: string; header: string }
  ? { kind: 'query'; key: E['query'] } | { kind: 'header'; key: E['header'] }
  : E extends { query: string }
    ? { kind: 'query'; key: E['query'] }
    : E extends { header: string }
      ? { kind: 'header'; key: E['header'] }
      : never
type GetParamData<
  T,
  E = RefinedExtra<T, ParamKey>,
  Type = RefineBaseType<T, ParamKey>
> = RefinedOf<T, ParamKey> extends true
  ? {
      info: CreateParamInfo<E>
      data: Type
    }
  : never
export interface ParamDataBase {
  info: { kind: 'query'; key: string } | { kind: 'header'; key: string }
  data: any
}
type ShouldParamData<T> = T extends ParamDataBase
  ? T['info'] extends never ? never : T
  : never
type DataUndefinedKeys<T extends { [k: string]: { data: any } }> = KeysOfType<
  { [K in keyof T]: T[K]['data'] },
  undefined
>
type HandleOptionalKeys<
  T extends { [k: string]: { data: any } },
  K extends keyof T = DataUndefinedKeys<T>
> = MakeKeysOptional<T, K>
type GetParams<
  T,
  Tp = OmitNever<
    {
      [k in Exclude<keyof T, keyof any[]>]: ShouldParamData<GetParamData<T[k]>>
    }
  >
> = T extends any[]
  ? Tp extends { [k: string]: ParamDataBase }
    ? keyof HandleOptionalKeys<Tp> extends never
      ? never
      : HandleOptionalKeys<Tp>
    : never
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
      params: GetParams<Ps>
      urlparams: GetUrlParams<Ps>
      files: GetFiles<Ps>
      body: GetBody<Ps>
      requiresAuth: ReqAuth
      reqRoles: Auth extends string[] ? Auth : never
    }
  : never

export type ApiContract<T> = { [k in MethodKeys<T>]: MethodType<T, k> }

export type HttpMethods =
  | 'POST'
  | 'GET'
  | 'DELETE'
  | 'PUT'
  | 'PATCH'
  | 'OPTIONS'

export const methodMap = {
  POST: 'post' as 'post',
  GET: 'get' as 'get',
  DELETE: 'delete' as 'delete',
  PUT: 'put' as 'put',
  PATCH: 'patch' as 'patch',
  OPTIONS: 'options' as 'options',
}

export type KeysOfType<T, Type> = {
  [K in keyof T]-?: Type extends T[K] ? K : never
}[keyof T]
export type NeverKeys<T> = {
  [K in keyof T]-?: T[K] extends never ? K : never
}[keyof T]
export type Overwrite<A, B> = Pick<A, Exclude<keyof A, keyof B>> & B
export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
export type OmitNever<T> = Omit<T, NeverKeys<T>>
type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never
type MakeKeysOptional<T, K extends keyof T> = Overwrite<T, { [k in K]+?: T[K] }>
