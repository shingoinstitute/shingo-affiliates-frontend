import { ValidatorFn } from '@angular/forms'

const pattern = /^(?:(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))$|^((?:[a-z]{2,3}(?:(?:-[a-z]{3}){1,3})?)|[a-z]{4}|[a-z]{5,8})(?:-([a-z]{4}))?(?:-([a-z]{2}|\d{3}))?((?:-(?:[\da-z]{5,8}|\d[\da-z]{3}))*)?((?:-[\da-wy-z](?:-[\da-z]{2,8})+)*)?(-x(?:-[\da-z]{1,8})+)?$|^(x(?:-[\da-z]{1,8})+)$/i

/**
 * The regex validator gives some false positives, but no false negatives
 * (i.e. it allows some invalid langs, but doesn't exclude any from the examples)
 */
export const isValidBCP47 = (x: string) => pattern.test(x)
export const bcp47Validator = (allowEmpty = false): ValidatorFn => control => {
  const valid =
    typeof control.value === 'string' &&
    (isValidBCP47(control.value) || (allowEmpty && control.value === ''))
  return !valid ? { bcp47: { value: control.value } } : null
}
