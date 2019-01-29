import { HKT2 } from './HKT'
import { Fn } from './types'

export const URI = 'Either/URI'
export type URI = typeof URI

declare module './HKT' {
  interface URI2HKT2<L, A> {
    'Either/URI': Either<L, A>
  }
}

export const tag = Symbol('Either/Tag')
const TagLeft = Symbol('Either/Left')
const TagRight = Symbol('Either/Right')

interface EitherBase<L, A> extends HKT2<URI, L, A> {
  readonly [tag]: typeof TagLeft | typeof TagRight
  value: L | A
}

export interface Left<L> extends EitherBase<L, never> {
  readonly [tag]: typeof TagLeft
  value: L
}

export interface Right<R> extends EitherBase<never, R> {
  readonly [tag]: typeof TagRight
  value: R
}

export type Either<L, R> = Left<L> | Right<R>
export const left = <L>(value: L): Left<L> =>
  ({ [tag]: TagLeft, value } as Left<L>)
export const right = <R>(value: R): Right<R> =>
  ({ [tag]: TagRight, value } as Right<R>)
export const isLeft = <L, R>(either: Either<L, R>): either is Left<L> =>
  either[tag] === TagLeft
export const isRight = <L, R>(either: Either<L, R>): either is Right<R> =>
  either[tag] === TagRight

export const bimap = <L, V, A, B>(
  fla: Either<L, A>,
  f: Fn<[L], V>,
  g: Fn<[A], B>,
): Either<V, B> => (isRight(fla) ? right(g(fla.value)) : left(f(fla.value)))

export const bimapC = <L, V, A, B>(f: Fn<[L], V>, g: Fn<[A], B>) => (
  fla: Either<L, A>,
) => bimap(fla, f, g)

export const map = <L, A, B>(fla: Either<L, A>, f: Fn<[A], B>): Either<L, B> =>
  isRight(fla) ? right(f(fla.value)) : fla

export const mapC = <L, A, B>(f: Fn<[A], B>) => (
  fla: Either<L, A>,
): Either<L, B> => map(fla, f)

export const chain = <L, A, B>(fla: Either<L, A>, f: Fn<[A], Either<L, B>>) =>
  isRight(fla) ? f(fla.value) : fla

export const chainC = <L, A, B>(f: Fn<[A], Either<L, B>>) => (
  fla: Either<L, A>,
) => chain(fla, f)

export const match = <L, V, A, B>(
  fla: Either<L, A>,
  Left: Fn<[L], V>,
  Right: Fn<[A], B>,
): V | B => (isRight(fla) ? Right(fla.value) : Left(fla.value))

export const matchC = <L, V, A, B>(Left: Fn<[L], V>, Right: Fn<[A], B>) => (
  fla: Either<L, A>,
): V | B => match(fla, Left, Right)
