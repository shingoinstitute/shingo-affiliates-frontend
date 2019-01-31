import { Filter } from './filter.abstract'
import { constant, T, tuple } from '../../util/functional'
import * as maybe from '../../util/functional/Maybe'
// tslint:disable-next-line:no-duplicate-imports
import { Maybe } from '../../util/functional/Maybe'
import { combineLatest, EMPTY } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

const applyCriteria = <T, C>(fm: {
  filterFn: Filter<T, C>['_filter']
  reqs: [() => boolean, () => Maybe<any>]
}) => {
  const criteria = fm.reqs[1]()
  const active = fm.reqs[0]()

  return maybe.isNothing(criteria) || !active
    ? constant(true)
    : fm.filterFn(criteria.value)
}

export class EveryFilter<T, C extends Array<Filter<T, any>>> extends Filter<
  T,
  C
> {
  dependencies$() {
    const base = super.dependencies$()
    // whenever the dependencies of any criteria filter change, we emit our dependencies
    const subchanges$ = this.criteria$.pipe(
      mergeMap(
        maybe.matchC({
          Just: filters => combineLatest(filters.map(f => f.dependencies$())),
          Nothing: () => EMPTY,
        }),
      ),
    )

    return subchanges$.pipe(mergeMap(() => base))
  }

  _filter = (criteria: C) => {
    const filters = criteria.map(f => ({
      filterFn: f._filter,
      reqs: tuple(f.getActive.bind(f), f.getCriteria.bind(f)),
    }))

    const filterFns = filters.map(applyCriteria)
    return (v: T) => filterFns.every(T(v))
  }
}
