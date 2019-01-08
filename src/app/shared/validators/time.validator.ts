import { ValidatorFn, Validators } from '@angular/forms'

/**
 * Validates that the given control has a value that
 * is a correct time string in the form HH:mm(:ss)?
 * @param control A form control
 */
export const TimeValidator: ValidatorFn = control => {
  const errors = Validators.pattern(/^\d\d:\d\d(:\d\d)?$/)(control)
  return !errors ? errors : { time: true }
}
