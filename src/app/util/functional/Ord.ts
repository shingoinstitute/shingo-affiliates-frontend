import { Ordering, sign } from './Ordering'
import { Setoid, setoidString, setoidNumber, setoidBoolean } from './Setoid'
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

export interface Ord<A> extends Setoid<A> {
  readonly compare: BinaryOp<A, Ordering>
}

export const unsafeCompare = (x: any) => (y: any): Ordering =>
  x < y ? -1 : x > y ? 1 : 0

export const fromCompare = <A>(compare: BinaryOp<A, Ordering>): Ord<A> => ({
  equals: x => y => compare(x)(y) === 0,
  compare,
})

export const contramap = <A, B>(f: (b: B) => A) => (fa: Ord<A>): Ord<B> =>
  fromCompare(on(fa.compare)(f))

export const ordString: Ord<string> = {
  ...setoidString,
  compare: x => y => sign(x.localeCompare(y)),
}

export const ordNumber: Ord<number> = {
  ...setoidNumber,
  compare: unsafeCompare,
}

export const ordBoolean: Ord<boolean> = {
  ...setoidBoolean,
  compare: unsafeCompare,
}

export const ordNumValue = contramap((d: { valueOf: () => number }) =>
  d.valueOf(),
)(ordNumber)

export const ordDate: Ord<Date> = ordNumValue

/**
 * Test whether one value is _strictly less than_ another
 * @function
 * @since 1.0.0
 */
export const lessThan = <A>(O: Ord<A>): BinaryOp<A, boolean> => x => y =>
  O.compare(x)(y) === -1

/**
 * Test whether one value is _strictly greater than_ another
 * @function
 * @since 1.0.0
 */
export const greaterThan = <A>(O: Ord<A>): BinaryOp<A, boolean> => x => y =>
  O.compare(x)(y) === 1

/**
 * Test whether one value is _non-strictly less than_ another
 * @function
 * @since 1.0.0
 */
export const lessThanOrEq = <A>(O: Ord<A>): BinaryOp<A, boolean> => x => y =>
  O.compare(x)(y) !== 1

/**
 * Test whether one value is _non-strictly greater than_ another
 * @function
 * @since 1.0.0
 */
export const greaterThanOrEq = <A>(O: Ord<A>): BinaryOp<A, boolean> => x => y =>
  O.compare(x)(y) !== -1
