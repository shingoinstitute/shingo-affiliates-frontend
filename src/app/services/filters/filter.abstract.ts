import { Observable, BehaviorSubject, of } from 'rxjs'
import { map, mergeMap, filter, combineLatest } from 'rxjs/operators'
import { Maybe, nothing, just, isNothing } from '../../util/functional/Maybe'
import { URIS, Type } from '../../util/functional/HKT'

export const arrayFilter = <T, C>(
  fn: (criteria: C) => (data: T) => boolean,
) => (criteria: C) => (data: T[]) => data.filter(fn(criteria))

export const observableFilter = <T, C>(
  fn: (criteria: C) => (data: T) => boolean,
) => (criteria: C) => (data: Observable<T>) => data.pipe(filter(fn(criteria)))

export const applyFilter = <URI extends URIS, T, C>(
  data: Type<URI, T>,
  filterFn: (criteria: C) => (data: Type<URI, T>) => Type<URI, T>,
) => ([criteria, active]: [Maybe<C>, boolean]) =>
  isNothing(criteria) || !active ? data : filterFn(criteria[1])(data)

export interface FilterBase<T, C> {
  readonly name: string
  criteria: C
  filter(data: Observable<T>): Observable<T>
  filter(data: T[]): Observable<T[]>
}

export abstract class Filter<T, C> implements FilterBase<T, C> {
  public get name(): string {
    return this._name
  }

  public set criteria(v: C) {
    this.criteriaSource.next(just(v))
  }

  public set active(v: boolean) {
    this.activeSource.next(v)
  }

  protected activeSource: BehaviorSubject<boolean> = new BehaviorSubject(false)
  protected criteriaSource: BehaviorSubject<Maybe<C>> = new BehaviorSubject(
    nothing as Maybe<C>,
  )
  protected abstract _filter: (criteria: C) => (data: T) => boolean

  constructor(protected _name: string) {}

  /**
   * Accepts an array or observable of data, and returns an observable of filtered data
   * @param data an array or observable of data
   */
  public filter(data: Observable<T>): Observable<T>
  public filter(data: T[]): Observable<T[]>
  public filter(data: T[] | Observable<T>): Observable<T[]> | Observable<T> {
    const source = this.criteriaSource.pipe(combineLatest(this.activeSource))
    return Array.isArray(data)
      ? source.pipe(
          map(applyFilter<'Array', T, C>(data, arrayFilter(this._filter))),
        )
      : source.pipe(
          mergeMap(
            applyFilter<'Observable', T, C>(
              data,
              observableFilter(this._filter),
            ),
          ),
        )
  }
}
