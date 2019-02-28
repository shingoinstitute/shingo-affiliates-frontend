import { JWTService } from '../services/auth/auth.service'
import { HttpHeaders } from '@angular/common/http'
import { ValidationErrors, FormGroup } from '@angular/forms'
import { Moment, isMoment } from 'moment'
import { tuple, Fn } from './functional'
import {
  reduce,
  repeat,
  join,
  map as mapI,
  filter as filterI,
} from './iterable'
import { left } from './functional/Either'
import { AsyncResult } from './types'
// tslint:disable-next-line: no-implicit-dependencies
import { DescribeSObjectResult } from 'jsforce'
import { take, takeUntil } from 'rxjs/operators'
import { OperatorFunction, Observable } from 'rxjs'

const noop = () => {}

/**
 * Subscribes to two observables and kills the subscriptions when either observable emits
 * @param getSuccess a function filtering to the first observable
 * @param getError a function filtering to the second observable
 */
export const subscribeTwo = <T, ASucc, AErr>(
  actions$: Observable<T>,
  getSuccess: OperatorFunction<T, ASucc>,
  getError: OperatorFunction<T, AErr>,
) => ({
  success = noop,
  error = noop,
}: { success?: Fn<[ASucc], void>; error?: Fn<[AErr], void> } = {}) => {
  const success$ = actions$.pipe(
    getSuccess,
    take(1),
  )

  const error$ = actions$.pipe(
    getError,
    take(1),
    // terminates error subscription on action success
    // we do this since we cant have the success subscription terminate the error subscription
    // and also have the error subscription terminate the success subscription
    takeUntil(success$),
  )

  const sub = success$.subscribe(success)
  error$.subscribe(e => {
    error(e)
    sub.unsubscribe()
  })
}

/**
 * Polyfill for `Object.entries`, returning an iterable.
 * Also returns ownPropertySymbols
 *
 * Iterates over the enumerable keys of a record yielding (key, value) pairs, similar to `Map.prototype.entries`
 *
 * Yielded entries have no guaranteed order, unlike Map, which returns in insertion order
 * @param map a javascript plain object
 */
export function* recordEntries<R extends Record<any, any>>(
  map: R,
): IterableIterator<[keyof R, R[keyof R]]> {
  // using the iterable map here avoids traversing the Object.keys array twice
  yield* mapI(Object.keys(map), (k: keyof R) => tuple(k, map[k]))

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

/**
 * Polyfill for `Object.fromEntries`
 */
export const toRecord = <K extends keyof any, V>(entries: Iterable<[K, V]>) =>
  reduce(
    entries,
    (acc, [key, value]) => {
      acc[key] = value
      return acc
    },
    {} as Record<K, V>,
  )

export const pick = <O, Ks extends Array<keyof O>>(
  obj: O,
  keys: Ks,
): Pick<O, Ks[number]> =>
  toRecord(filterI(recordEntries(obj), ([k, _]) => keys.includes(k))) as Pick<
    O,
    Ks[number]
  >

export const leftpad = (n: number, c: string = ' ') => (s: string) => {
  if (typeof (s as any).padStart === 'function') {
    return (s as any).padStart(n, c)
  }
  return join(repeat(c, n - s.length)) + s
}

/**
 * Takes a date or moment object and returns a string in the format YYYY-MM-DD
 * @param date a date or moment object
 * @param utc whether to return the local date or a utc date
 */
export const getIsoYMD = (date: Moment | Date, utc = false): string => {
  const pad = leftpad(2, '0')
  if (utc) {
    if (date instanceof Date) {
      return `${date.getUTCFullYear()}-${pad(
        String(date.getUTCMonth() + 1),
      )}-${pad(String(date.getUTCDate()))}`
    } else {
      return date.utc().format('YYYY-MM-DD')
    }
  } else {
    if (date instanceof Date) {
      return `${date.getFullYear()}-${pad(String(date.getMonth() + 1))}-${pad(
        String(date.getDate()),
      )}`
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
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase(),
    )
    .replace(/\s+/g, '')

export const GLOBAL_ID_PREFIX = 'PORTAL_CREATED_'
export const isPortalCreated = (w: { Id: string }, sfx = '') =>
  w.Id.startsWith(`${GLOBAL_ID_PREFIX + (sfx ? sfx + ':' : '')}`)

export const getDescribes = (data: DescribeSObjectResult) =>
  toRecord(
    mapI(
      filterI(
        data.fields,
        field =>
          !!(field.inlineHelpText || field.label || field.picklistValues),
      ),
      field => {
        const picked = pick(field, [
          'inlineHelpText',
          'label',
          'name',
          'picklistValues',
        ])
        return tuple(
          sfToCamelCase(field.name),
          // since it's not safe to access a record with keys over an infinite type (like string)
          // we say the values have the possiblility of being undefined, since
          // the values will be undefined for some string keys
          // (not all, but most, since the number of possible keys is infinite)
          picked as typeof picked | undefined,
        )
      },
    ),
  )

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

export const unloadedAsync: AsyncResult<never, never> = left({
  tag: 'unloaded' as 'unloaded',
})
export const loadingAsync: AsyncResult<never, never> = left({
  tag: 'loading' as 'loading',
})
export const failedAsync = (err: unknown) =>
  left({ tag: 'failed' as 'failed', value: err })
