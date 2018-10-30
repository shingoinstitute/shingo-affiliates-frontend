// taken from gcanti/fp-ts
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

export interface HKT<URI, A> {
  readonly _URI: URI
  readonly _A: A
}

export interface HKT2<URI, L, A> extends HKT<URI, A> {
  readonly _L: L
}

export interface HKT3<URI, U, L, A> extends HKT2<URI, L, A> {
  readonly _U: U
}

// tslint:disable:no-empty-interface
export interface URI2HKT<A> {}
export interface URI2HKT2<L, A> {}
export interface URI2HKT3<U, L, A> {}

// URI constraints with dictionary integrity constraint

export type URIS = (URI2HKT<any> & { never: HKT<never, never> })[
  | keyof URI2HKT<any>
  | 'never']['_URI']
export type URIS2 = (URI2HKT2<any, any> & { never: HKT<never, never> })[
  | keyof URI2HKT2<any, any>
  | 'never']['_URI']
export type URIS3 = (URI2HKT3<any, any, any> & { never: HKT<never, never> })[
  | keyof URI2HKT3<any, any, any>
  | 'never']['_URI']

export type Type<URI extends URIS, A> = {} & URI2HKT<A>[URI]
export type Type2<URI extends URIS2, L, A> = {} & URI2HKT2<L, A>[URI]
export type Type3<URI extends URIS3, U, L, A> = {} & URI2HKT3<U, L, A>[URI]

// Type-level integrity check

/* tslint:disable */
(null! as URI2HKT<any>) as { [k in keyof URI2HKT<any>]: HKT<k, any> }
(null! as URI2HKT2<any, any>) as {
  [k in keyof URI2HKT2<any, any>]: HKT2<k, any, any>
}
(null! as URI2HKT3<any, any, any>) as {
  [k in keyof URI2HKT3<any, any, any>]: HKT3<k, any, any, any>
}
/* tslint:enable */
