import { JWTService } from '../services/auth/auth.service'
import { HttpHeaders } from '@angular/common/http'
import { ValidationErrors, FormGroup } from '@angular/forms'
import { Moment, isMoment } from 'moment'
import { tuple } from './functional'
import { reduce } from './iterable'

/**
 * Iterates over the enumerable keys of a record yielding (key, value) pairs, similar to `Map.prototype.entries`
 *
 * Yielded entries have no guaranteed order, unlike Map, which returns in insertion order
 * @param map a javascript plain object
 */
export function* recordEntries<R extends Record<any, any>>(
  map: R,
): IterableIterator<[keyof R, R[keyof R]]> {
  for (const key in map) {
    if (map.hasOwnProperty(key)) {
      yield tuple(key, map[key])
    }
  }

  for (const sym of Object.getOwnPropertySymbols(map)) {
    if (map.hasOwnProperty(sym)) {
      // typescript cannot do symbol indexing as of 3.1. See: https://github.com/Microsoft/TypeScript/issues/24587 and https://github.com/Microsoft/TypeScript/issues/1863
      yield tuple(
        sym as Extract<keyof R, symbol>,
        (map as any)[sym] as R[keyof R],
      )
    }
  }
}

export const toRecord = <K extends keyof any, V>(entries: Iterable<[K, V]>) =>
  reduce(
    entries,
    (acc, curr) => {
      const [key, value] = curr
      acc[key] = value
      return acc
    },
    {} as Record<K, V>,
  )

/**
 * Takes a date or moment object and returns a string in the format YYYY-MM-DD
 * @param date a date or moment object
 * @param utc whether to return the local date or a utc date
 */
export const getIsoYMD = (date: Moment | Date, utc = false): string => {
  if (utc) {
    if (date instanceof Date) {
      return `${date.getUTCFullYear()}-${date.getUTCMonth() +
        1}-${date.getUTCDate()}`
    } else {
      return date.utc().format('YYYY-MM-DD')
    }
  } else {
    if (date instanceof Date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    } else {
      return date.format('YYYY-MM-DD')
    }
  }
}

/**
 * Adds a property to an object if the given value is not null or undefined
 * @param base the base object to add the property to
 * @param key the property name
 * @param value the property value
 */
export const addIf = <T, K extends keyof T>(
  base: T,
  key: K,
  value: T[K] | null | undefined,
) => {
  if (value != null) base[key] = value
}

export const withoutTime = (d: Date | Moment) => {
  const newDate = isMoment(d) ? d.toDate() : new Date(d)
  newDate.setHours(0, 0, 0, 0)
  return newDate
}

export const notUndefined = <T>(v: T): v is Exclude<T, undefined> =>
  typeof v !== 'undefined'

/**
 * Removes diacritical marks from a string
 * @see https://thread.engineering/2018-08-29-searching-and-sorting-text-with-diacritical-marks-in-javascript/
 * @param value a string
 */
export const normalizeString = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export const getFormValidationErrors = (form: FormGroup) => {
  const map: { [name: string]: ValidationErrors } = {}
  Object.keys(form.controls).forEach(key => {
    const controlErrors = form.controls[key].errors
    if (controlErrors != null) {
      map[key] = controlErrors
    }
  })
  return map
}

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

export const filterMapC = <A, B>(
  filter: (v: A, i: number, arr: A[]) => boolean,
  map: (v: A, i: number, arr: A[]) => B,
) => (xs: A[]) => filterMap(xs, filter, map)

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
