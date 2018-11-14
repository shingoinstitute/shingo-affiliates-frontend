import { Observable, BehaviorSubject, combineLatest } from 'rxjs'
import { map, mergeMap, filter } from 'rxjs/operators'
import { Maybe, nothing, just, isNothing } from '../../../util/functional/Maybe'
import { constant } from '../../../util/functional'

export const applyCriteria = <T, C>(
  filterFn: (criteria: C) => (data: T) => boolean,
) => ([criteria, active]: [Maybe<C>, boolean]) =>
  isNothing(criteria) || !active ? constant(true) : filterFn(criteria.value)

export interface FilterBase<T, C> {
  readonly name: string
  criteria: C | undefined
  filter(data: Observable<T>): Observable<T>
  filter(data: T[]): Observable<T[]>
}

export abstract class Filter<T, C> implements FilterBase<T, C> {
  protected activeSource: BehaviorSubject<boolean> = new BehaviorSubject(false)
  protected criteriaSource: BehaviorSubject<Maybe<C>> = new BehaviorSubject(
    nothing as Maybe<C>,
  )

  abstract _filter: (criteria: C) => (data: T) => boolean

  public get name(): string {
    return this._name
  }

  public set criteria(v: C | undefined) {
    if (v) {
      this.criteriaSource.next(just(v))
    } else {
      this.criteriaSource.next(nothing)
    }
  }

  public getCriteria() {
    return this.criteriaSource.value
  }

  public get criteria$() {
    return this.criteriaSource.asObservable()
  }

  public set active(v: boolean) {
    this.activeSource.next(v)
  }

  public getActive() {
    return this.activeSource.value
  }

  public get active$() {
    return this.activeSource.asObservable()
  }

  constructor(protected _name: string, criteria?: C) {
    if (typeof criteria !== 'undefined') {
      this.criteria = criteria
    }
  }

  public dependencies$() {
    return combineLatest(this.criteria$, this.active$)
  }

  /**
   * Accepts an array or observable of data, and returns an observable of filtered data
   * @param data an array or observable of data
   */
  public filter(data: Observable<T>): Observable<T>
  public filter(data: T[]): Observable<T[]>
  public filter(data: T[] | Observable<T>): Observable<T[]> | Observable<T> {
    const deps = this.dependencies$()
    return Array.isArray(data)
      ? deps.pipe(map(c => data.filter(applyCriteria(this._filter)(c))))
      : deps.pipe(mergeMap(c => filter(applyCriteria(this._filter)(c))(data)))
  }
}
