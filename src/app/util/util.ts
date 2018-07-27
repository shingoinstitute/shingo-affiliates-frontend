import { JWTService } from '../services/auth/auth.service';
import { HttpHeaders } from '@angular/common/http';

export const requestOptions = (
  jwt: JWTService,
  ...headerList: Array<[string, string | string[]]>) => {
  const headers = headerList.reduce(
    (h, c) => h.set(c[0], c[1]),
    new HttpHeaders().set('x-jwt', jwt.jwt || '')
  );

  return {
    headers,
    withCredentials: true
  };
};

/**
 * Converts a salesforce field name to a camel case string
 * @param s The salesforce field name (often ends in __c)
 */
export const sfToCamelCase = (s: string): string => {
  s = s.split('__c').join('').split('_').join(' ');
  return s.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
};

/**
 * Error responses from the API like to change error objects into JSON strings
 * for some reason. This method attempts to un-stringify the error object
 * so that a useful error code can be extracted from the response.
 *
 * For instance, the below response object:
 *
 * ```javascript
 * {
 *  error: "\{\"error\":\"something terrible has happened\"\}",
 * }
 * ```
 *
 * should become:
 *
 * ```javascript
 * {
 *  error: {
 *    error: "something terrible has happened"
 *  }
 * }
 * ```
 *
 * @param obj The error object
 */
export function parseErrResponse(obj: object): string {
  const key = 'error';
  while (obj.hasOwnProperty(key)) {
    obj = obj[key];
    if (typeof obj === 'string') {
      const message: string = obj;
      if (message.match(/\{.*\}/g)) {
        try {
          obj = JSON.parse(message);
          console.warn(obj);
        } catch (e) {
          return '';
        }
      } else {
        return message;
      }
    }
  }
  return '';
}
