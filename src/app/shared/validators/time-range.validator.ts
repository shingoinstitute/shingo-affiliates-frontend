import { Moment } from 'moment'
import { ValidatorFn } from '@angular/forms'
import { eq, lte, lt, gte, gt, Lazy } from '~app/util/functional'

export type TimeRangeInput =
  | Date
  | Moment
  | number
  | false
  | ''
  | null
  | undefined

/**
 * Validates that a point in time occurs before or after the specified point
 * @param otherDate the other point in time
 * @param mode should the validated point occur before or after the other point?
 * @param allowEqual if mode is before or after, allow equal points to be valid
 */
export const TimeRangeValidator = (
  otherDate: TimeRangeInput | Lazy<TimeRangeInput>,
  mode: 'before' | 'after' | 'equal' = 'after',
  allowEqual = true,
  mapControlFn?: (value: unknown) => TimeRangeInput,
): ValidatorFn => control => {
  const value: TimeRangeInput =
    typeof mapControlFn !== 'undefined'
      ? mapControlFn(control.value)
      : control.value

  if (!value && value !== 0) return null

  const other = typeof otherDate === 'function' ? otherDate() : otherDate
  if (!other && other !== 0) return null

  const otherMilli = other.valueOf()
  const valueMilli = value.valueOf()

  const isValidFn =
    mode === 'equal'
      ? eq
      : mode === 'before'
        ? allowEqual
          ? lte
          : lt
        : allowEqual
          ? gte
          : gt

  const valid = isValidFn(valueMilli, otherMilli)

  return valid ? null : { 'time-range': mode }
}
