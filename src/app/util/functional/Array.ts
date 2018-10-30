declare global {
  interface Array<T> {
    _URI: URI
    _A: T
  }
}

declare module './HKT' {
  interface URI2HKT<A> {
    Array: A[]
  }
}

export const URI = 'Array'
export type URI = typeof URI

export const reduce1 = <A>(fn: (b: A, a: A) => A) => (fa: A[]) => fa.reduce(fn)
export const reduce = <A, B>(fn: (b: B, a: A) => B, b: B) => (fa: A[]) =>
  fa.reduce(fn, b)
export const of = <A>(a: A): A[] => [a]
export const map = <A, B>(fn: (a: A) => B) => (fa: A[]) => fa.map(fn)
