import {
  HttpMethods,
  methodMap,
  ParamDataBase,
} from '../../../util/api-contract'
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { OmitNever } from '../../../util/types'

export interface ContractMethod {
  metadata: {
    route: string
    method: HttpMethods
  }
  body: any
  urlparams: { [k: string]: string }
  params: Partial<{
    [k: string]: ParamDataBase
  }>
  files: { [k: string]: File[] }
  returntype: any
}

export interface NoDataContractMethod extends ContractMethod {
  body: never
  urlparams: never
  params: never
  files: never
}

export const fillroute = (
  route: string,
  params: ContractMethod['urlparams'],
): string => {
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      // tslint:disable-next-line:no-parameter-reassignment
      route = route.replace(`:${key}`, params[key])
    }
  }

  return route
}

export const getParams = (params: ContractMethod['params']) => {
  const headers: { [h: string]: string | string[] } = {}
  const queries: { [q: string]: string | string[] } = {}

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key]
      if (typeof value !== 'undefined' && typeof value.data !== 'undefined') {
        const data = Array.isArray(value.data)
          ? value.data.map(v => String(v))
          : String(value.data)
        if (value.info.kind === 'query') {
          queries[`${value.info.key}`] = data
        } else if (value.info.kind === 'header') {
          headers[`x-${value.info.key}`] = data
        }
      }
    }
  }

  const returned: { headers?: typeof headers; params?: typeof queries } = {}
  if (Object.keys(headers).length > 0) returned.headers = headers
  if (Object.keys(queries).length > 0) returned.params = queries

  return returned
}
export interface HttpOptionsSubset {
  body?: any
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[]
      }
  params?:
    | HttpParams
    | {
        [header: string]: string | string[]
      }
}

export abstract class ApiBase {
  get authHost() {
    return environment.apiUrl
  }
  constructor(protected http: HttpClient) {}
  protected request<Base extends NoDataContractMethod = never>(
    route: Base['metadata']['route'],
    method: Base['metadata']['method'],
  ): Observable<Base['returntype']>
  protected request<Base extends ContractMethod = never>(
    route: Base['metadata']['route'],
    method: Base['metadata']['method'],
    data: OmitNever<{
      body: Base['body']
      urlparams: Base['urlparams']
      params: Base['params']
      files: Base['files']
    }>,
    noExecute: true,
  ): {
    url: string
    method: (typeof methodMap)[keyof typeof methodMap]
    options: HttpOptionsSubset
  }
  protected request<Base extends ContractMethod = never>(
    route: Base['metadata']['route'],
    method: Base['metadata']['method'],
    data: OmitNever<{
      body: Base['body']
      urlparams: Base['urlparams']
      params: Base['params']
      files: Base['files']
    }>,
    noExecute?: false,
  ): Observable<Base['returntype']>
  protected request(
    route: ContractMethod['metadata']['route'],
    method: ContractMethod['metadata']['method'],
    data?: {
      body?: ContractMethod['body']
      urlparams?: ContractMethod['urlparams']
      params?: ContractMethod['params']
      files?: ContractMethod['files']
    },
    noExecute = false,
  ):
    | Observable<ContractMethod['returntype']>
    | {
        url: string
        method: (typeof methodMap)[keyof typeof methodMap]
        options: HttpOptionsSubset
      } {
    const urlparams = data && data.urlparams
    const realroute = (urlparams && fillroute(route, urlparams)) || route
    const url = `${this.authHost}${realroute}`
    const files = data && data.files
    const filesBody = files && new FormData()
    const { headers, params } =
      (data && data.params && getParams(data.params)) ||
      ({} as ReturnType<typeof getParams>)

    if (filesBody && files) {
      for (const fieldName in files) {
        if (files.hasOwnProperty(fieldName)) {
          const fileList = files[fieldName]
          for (const file of fileList) {
            filesBody.append(fieldName, file, file.name)
          }
        }
      }
    }

    const body = (data && data.body) || filesBody

    const options: HttpOptionsSubset = {}
    if (typeof body !== 'undefined') options.body = body
    if (headers) options.headers = headers
    if (params) options.params = params
    const realMethod = methodMap[method]
    if (noExecute) return { options, url, method: realMethod }

    return this.http.request(realMethod, url, options)
  }
}
