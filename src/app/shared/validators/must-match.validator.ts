import { ValidatorFn } from '@angular/forms'
import { tuple } from '../../util/functional'

export const mustMatchValidator = (
  names: string[],
  comparator: (a: unknown, b: unknown) => boolean = (a, b) => a === b,
): ValidatorFn => control => {
  if (!control.parent) return null

  if (names.length === 0)
    throw new Error(
      'mustMatchValidator(): must provide at least one control name',
    )

  const values = names.map(n => {
    const g = control.parent.get(n)
    if (!g)
      throw new Error(
        `mustMatchValidator(): control ${n} does not exist in parent group`,
      )
    g.valueChanges.subscribe(() => control.updateValueAndValidity())
    return tuple(n, g.value)
  })

  const value = control.value
  let reason = null
  const allEqual = values.every(([n, a]) => {
    if (!comparator(a, value)) {
      reason = `Control ${n} with value ${a} does not match ${value}`
      return false
    }
    return true
  })

  return allEqual ? null : { must_match: reason }
}
