import { BinaryOp } from './types'
import { contramap, ordNumber, Ord } from 'fp-ts/lib/Ord'

export const ordNumValue = contramap(
  (d: { valueOf: () => number }) => d.valueOf(),
  ordNumber,
)

export const ordDate: Ord<Date> = ordNumValue

/**
 * Test whether one value is _strictly less than_ another
 * @function
 * @since 1.0.0
 */
export const lessThanC = <A>(O: Ord<A>): BinaryOp<A, boolean> => x => y =>
  O.compare(x, y) === -1

/**
 * Test whether one value is _strictly greater than_ another
 * @function
 * @since 1.0.0
 */
export const greaterThanC = <A>(O: Ord<A>): BinaryOp<A, boolean> => x => y =>
  O.compare(x, y) === 1

/**
 * Test whether one value is _non-strictly less than_ another
 * @function
 * @since 1.0.0
 */
export const lessThanOrEqC = <A>(O: Ord<A>): BinaryOp<A, boolean> => x => y =>
  O.compare(x, y) !== 1

/**
 * Test whether one value is _non-strictly greater than_ another
 * @function
 * @since 1.0.0
 */
export const greaterThanOrEqC = <A>(
  O: Ord<A>,
): BinaryOp<A, boolean> => x => y => O.compare(x, y) !== -1
