import { curry2 } from './internal/curry-by-arity';

interface Limits {
  readonly min?: number;
  readonly max?: number;
}

/**
 * Clamp the given value within the inclusive min and max bounds.
 *
 * @param value - The number.
 * @param limits - The bounds limits.
 * @signature
 *    clamp(value, { min, max });
 * @example
 *    clamp(10, { min: 20 }) // => 20
 *    clamp(10, { max: 5 }) // => 5
 *    clamp(10, { max: 20, min: 5 }) // => 10
 * @dataFirst
 * @category Number
 */
export function clamp(value: number, limits: Limits): number;

/**
 * Clamp the given value within the inclusive min and max bounds.
 *
 * @param limits - The bounds limits.
 * @signature
 *    clamp({ min, max })(value);
 * @example
 *    clamp({ min: 20 })(10) // => 20
 *    clamp({ max: 5 })(10) // => 5
 *    clamp({ max: 20, min: 5 })(10) // => 10
 * @dataLast
 * @category Number
 */
export function clamp(limits: Limits): (value: number) => number;

export function clamp(
  valueOrLimits: number | Limits,
  limits?: Limits,
): unknown {
  return curry2(clampImplementation, arguments.length, valueOrLimits, limits);
}

function clampImplementation(value: number, { max, min }: Limits): number {
  if (min !== undefined && value < min) {
    return min;
  }

  if (max !== undefined && value > max) {
    return max;
  }

  return value;
}
