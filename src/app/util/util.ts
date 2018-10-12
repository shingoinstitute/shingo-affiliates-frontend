import { JWTService } from '../services/auth/auth.service'
import { HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { pick } from 'lodash'
import { environment } from '../../environments/environment'

export const requestOptions = (
  jwt: JWTService,
  ...headerList: Array<[string, string | string[]]>
) => {
  const headers = headerList.reduce(
    (h, c) => h.set(c[0], c[1]),
    new HttpHeaders().set('x-jwt', jwt.jwt || ''),
  )

  return {
    headers,
    withCredentials: true,
  }
}

/**
 * Converts a salesforce field name to a camel case string
 * @param s The salesforce field name (often ends in __c)
 */
export const sfToCamelCase = (s: string): string => {
  s = s
    .split('__c')
    .join('')
    .split('_')
    .join(' ')
  return s
    .replace(
      /(?:^\w|[A-Z]|\b\w)/g,
      (letter, index) =>
        index === 0 ? letter.toLowerCase() : letter.toUpperCase(),
    )
    .replace(/\s+/g, '')
}

export const handleDescribe = map((data: { fields: any[] }) => {
  const props: {
    [x: string]: {
      name?: string | null
      inlineHelpText?: string | null
      label?: string | null
      picklistValues?: string | null
    }
  } = {}

  data.fields
    .filter(
      field => field.inlineHelpText || field.label || field.picklistValues,
    )
    .map(field =>
      pick(field, ['inlineHelpText', 'label', 'name', 'picklistValues']),
    )
    .forEach(picked => (props[sfToCamelCase(picked.name)] = picked))

  return props
})

export const getApiHost = () => environment.apiUrl
