import { on } from './functional'
import { BinaryOp } from './types'

// Adapted from gcanti/fp-ts
/*
MIT License

Copyright (c) 2017-2018 Giulio Canti

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

export interface Setoid<A> {
  readonly equals: BinaryOp<A, boolean>
}

export const contramap = <A, B>(f: (b: B) => A) => (
  fa: Setoid<A>,
): Setoid<B> => ({
  equals: on(fa.equals)(f),
})

export const strictEqual = <A>(a: A) => (b: A) => a === b
export const setoidStrict = { equals: strictEqual }

export const setoidString: Setoid<string> = setoidStrict
export const setoidNumber: Setoid<number> = setoidStrict
export const setoidBoolean: Setoid<boolean> = setoidStrict
export const setoidDate: Setoid<Date> = contramap((d: Date) => d.valueOf())(
  setoidNumber,
)

export const getArraySetoid = <A>(S: Setoid<A>): Setoid<A[]> => ({
  equals: xs => ys =>
    xs.length === ys.length && xs.every((x, i) => S.equals(x)(ys[i])),
})

export const getRecordSetoid = <O extends { [key: string]: any }>(
  setoids: { [K in keyof O]: Setoid<O[K]> },
): Setoid<O> => ({
  equals: x => y => {
    for (const k in setoids) {
      if (!setoids[k].equals(x[k])(y[k])) return false
    }
    return true
  },
})

export const getTupleSetoid = <A extends any[]>(
  setoids: { [K in keyof A]: Setoid<A[K]> },
): Setoid<A> => ({
  equals: xs => ys =>
    xs.length === ys.length && xs.every((x, i) => setoids[i].equals(x)(ys[i])),
})
