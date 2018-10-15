type Left<L> = [false, L]
type Right<R> = [true, R]
type Either<L, R> = Left<L> | Right<R>
const left = <L>(L: L): Left<L> => [false, L]
const right = <R>(R: R): Right<R> => [true, R]
const isLeft = <L, R>(either: Either<L, R>): either is Left<L> => !either[0]
const isRight = <L, R>(either: Either<L, R>): either is Right<R> => either[0]

const mapEither = <L, R, RR = R, LL = L>(
  mright: ((v: R) => RR),
  mleft?: ((v: L) => LL),
) => (either: Either<L, R>): Either<LL, RR> => {
  if (isRight(either)) {
    return right(mright(either[1]))
  }

  if (isLeft(either)) {
    return typeof mleft === 'function'
      ? left(mleft(either[1]))
      : ((either as any) as Left<LL>)
  }
}

const chainEither = <L, R, RR = R>(fr: ((v: R) => Either<L, RR>)) => (
  either: Either<L, R>,
): Either<L, RR> => {
  if (isRight(either)) {
    return fr(either[1])
  }

  return either
}
