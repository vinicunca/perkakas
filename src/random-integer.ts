import type {
  GreaterThan,
  GreaterThanOrEqual,
  IntRange,
  IsEqual,
  IsNever,
  NonNegativeInteger,
  Or,
} from 'type-fest';

type RandomInteger<From extends number, To extends number> =
  Or<
    IsNever<NonNegativeInteger<From>>,
    IsNever<NonNegativeInteger<To>>
  > extends true
    ? number
    : IsEqual<From, To> extends true
      ? From
      : GreaterThan<From, To> extends true
        ? never
        : GreaterThanOrEqual<To, 1000> extends true
          ? number
          : IntRange<From, To> | To;

/**
 * Generate a random integer between `from` and `to` (inclusive).
 *
 * @param from - The minimum value.
 * @param to - The maximum value.
 * @returns The random integer.
 * @signature
 *   P.randomInt(from, to)
 * @example
 *   P.randomInt(1, 10) // => 5
 *   P.randomInt(1.5, 2.6) // => 2
 * @dataFirst
 * @category Number
 */
export function randomInteger<From extends number, To extends number>(
  from: From,
  to: To,
): RandomInteger<From, To> {
  const fromCeiled = Math.ceil(from);
  const toFloored = Math.floor(to);

  if (toFloored < fromCeiled) {
    throw new RangeError(
      `randomInt: The range [${from},${to}] contains no integer`,
    );
  }

  return Math.floor(
    Math.random() * (toFloored - fromCeiled + 1) + fromCeiled,
  ) as RandomInteger<From, To>;
}
