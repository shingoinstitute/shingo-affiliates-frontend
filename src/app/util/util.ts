import { JWTService } from '../services/auth/auth.service'
import { HttpHeaders } from '@angular/common/http'

export const notUndefined = <T>(v: T): v is Exclude<T, undefined> =>
  typeof v !== 'undefined'

export const truthy = <T>(
  v: T,
): v is Exclude<T, false | 0 | '' | null | undefined> => Boolean(v)

export const requestOptions = (
  jwt: JWTService,
  ...headerList: Array<[string, string | string[]]>
) => {
  const headers = headerList.reduce(
    (h, c) => h.set(c[0], c[1]),
    new HttpHeaders().set('x-jwt', jwt.jwt || ''),
  )

  return {
    headers,
    withCredentials: true,
  }
}

export const XOR = (a: boolean, b: boolean) => (a || b) && (!a || !b)

export const filterMapC = <A, B>(
  filter: (v: A, i: number, arr: A[]) => boolean,
  map: (v: A, i: number, arr: A[]) => B,
) => (xs: A[]) => filterMap(xs, filter, map)

export const filterMap = <A, B>(
  xs: A[],
  filter: (v: A, i: number, arr: A[]) => boolean,
  map: (v: A, i: number, arr: A[]) => B,
) =>
  xs.reduce(
    (acc, c, idx, arr) => {
      if (filter(c, idx, arr)) acc.push(map(c, idx, arr))
      return acc
    },
    [] as B[],
  )
/**
 * Converts a salesforce field name to a camel case string
 * @param s The salesforce field name (often ends in __c)
 */
export const sfToCamelCase = (s: string): string =>
  s
    .split('__c')
    .join('')
    .split('_')
    .join(' ')
    .replace(
      /(?:^\w|[A-Z]|\b\w)/g,
      (letter, index) =>
        index === 0 ? letter.toLowerCase() : letter.toUpperCase(),
    )
    .replace(/\s+/g, '')

/**
 * Error responses from the API like to change error objects into JSON strings
 * for some reason. This method attempts to un-stringify the error object
 * so that a useful error code can be extracted from the response.
 *
 * For instance, the below response object:
 *
 * ```javascript
 * {
 *  error: "\{\"error\":\"something terrible has happened\"\}",
 * }
 * ```
 *
 * should become:
 *
 * ```javascript
 * {
 *  error: {
 *    error: "something terrible has happened"
 *  }
 * }
 * ```
 *
 * @param obj The error object
 */
export function parseErrResponse(obj: object): string {
  // tslint:disable:no-parameter-reassignment
  const key = 'error'
  while (obj.hasOwnProperty(key)) {
    obj = (obj as any)[key]
    if (typeof obj === 'string') {
      const message: string = obj
      if (message.match(/\{.*\}/g)) {
        try {
          obj = JSON.parse(message)
          console.warn(obj)
        } catch (e) {
          return ''
        }
      } else {
        return message
      }
    }
  }
  return ''
  // tslint:enable:no-parameter-reassignment
}

const decimalUnits = ['B', 'kB', 'MB', 'GB', 'TB', 'PB']
const binaryUnits = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']

export const getSizeUnit = (power: 0 | 1 | 2 | 3 | 4 | 5, binary = false) => {
  const baseVal = binary ? 1024 : 1000
  const units = binary ? binaryUnits : decimalUnits
  return [baseVal ** power, units[power]] as [number, string]
}

// if typescript had macros, this could be a compiletime calculation
const log1000 = 6.907755278982137 // Math.log(1000)

export const between = (lower: number, upper: number) => (num: number) =>
  num > upper ? upper : num < lower ? lower : num

/**
 * Returns the size in the nearest data unit
 * @param size Size in bytes
 */
export const withUnit = (size: number, binary = false) => {
  const power = between(0, 5)(Math.trunc(Math.log(size) / log1000))
  const [multiplier, unit] = getSizeUnit(power as 0 | 1 | 2 | 3 | 4 | 5, binary)
  return `${(size / multiplier).toFixed(2)} ${unit === 'B' ? 'Bytes' : unit}`
}
