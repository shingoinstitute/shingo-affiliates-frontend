import {
  HttpMethods,
  methodMap,
  OmitNever,
  ParamDataBase,
} from '../../../util/api-contract'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'

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

export abstract class ApiBase {
  get authHost() {
    return environment.apiUrl
  }
  constructor(private http: HttpClient) {}
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
  ): Observable<ContractMethod['returntype']> {
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

    const options: {
      body?: any
      headers?: typeof headers
      params?: typeof params
    } = {}
    if (typeof body !== 'undefined') options.body = body
    if (headers) options.headers = headers
    if (params) options.params = params

    return this.http.request(methodMap[method], url, options)
  }
}
