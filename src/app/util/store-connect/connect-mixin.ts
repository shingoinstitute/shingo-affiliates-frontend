// tslint:disable: max-classes-per-file
import { Fn, tuple } from '../functional'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { map } from '../iterable'
import { recordEntries, toRecord } from '../util'

// adapted from https://codeburst.io/having-fun-with-mixins-in-angular-719f1ec83aeb

type DispatchFn<T> = Store<T>['dispatch']

type Outputs<St, O> = (dispatch: DispatchFn<St>) => O

/**
 * Helper to create a class that uses the ngrx store
 * @param inputs a function that returns a string record of functions to apply to the store Observable
 * @param outputs a function that returns a string record of functions that dispatch actions
 */
export function mixinConnect<
  I extends Record<string, Fn<[Observable<any>], Observable<any>>>,
  O extends Record<string, () => void>,
  St
>(inputs: () => I, outputs: Outputs<St, O> = () => ({} as O)) {
  return class {
    vm: { [k in keyof I]: ReturnType<I[k]> } & O
    constructor(store: Store<St>) {
      const inputFns: I = inputs()
      const pipedInputs = toRecord(
        map(recordEntries(inputFns), ([key, fn]) => tuple(key, fn(store))),
      ) as { [k in keyof I]: ReturnType<I[k]> }

      const boundOutputs: O = outputs(store.dispatch.bind(store))

      this.vm = { ...boundOutputs, ...pipedInputs }
    }
  }
}
