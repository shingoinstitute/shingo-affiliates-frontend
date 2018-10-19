export type Left<L> = [false, L]
export type Right<R> = [true, R]
export type Either<L, R> = Left<L> | Right<R>
export const left = <L>(L: L): Left<L> => [false, L]
export const right = <R>(R: R): Right<R> => [true, R]
export const isLeft = <L, R>(either: Either<L, R>): either is Left<L> =>
  !either[0]
export const isRight = <L, R>(either: Either<L, R>): either is Right<R> =>
  either[0]

export const mapEither = <L, R, RR = R, LL = L>(
  mright: ((v: R) => RR),
  mleft?: ((v: L) => LL),
) => (either: Either<L, R>): Either<LL, RR> => {
  if (isRight(either)) {
    return right(mright(either[1]))
  } else {
    return typeof mleft === 'function'
      ? left(mleft(either[1]))
      : ((either as any) as Left<LL>)
  }
}

export const chainEither = <L, R, RR = R>(fr: ((v: R) => Either<L, RR>)) => (
  either: Either<L, R>,
): Either<L, RR> => {
  if (isRight(either)) {
    return fr(either[1])
  }

  return either
}
