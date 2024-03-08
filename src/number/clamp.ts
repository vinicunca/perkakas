import { purry } from '../function/purry';

interface Limits {
  readonly max?: number;
  readonly min?: number;
}

/**
 * Clamp the given value within the inclusive min and max bounds.
 * @param value the number
 * @param limits the bounds limits
 * @param limits.min the minimal bounds limits
 * @param limits.max the maximal bounds limits
 * @signature
 *    P.clamp(value, { min, max });
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
 * @param limits the bounds limits
 * @param limits.min the minimal bounds limits
 * @param limits.max the maximal bounds limits
 * @signature
 *    P.clamp({ min, max })(value);
 * @example
 *    clamp({ min: 20 })(10) // => 20
 *    clamp({ max: 5 })(10) // => 5
 *    clamp({ max: 20, min: 5 })(10) // => 10
 * @dataLast
 * @category Number
 */
export function clamp(limits: Limits): (value: number) => number;

export function clamp(...args: any[]): unknown {
  return purry(clamp_, args);
}

function clamp_(value: number, { max, min }: Limits): number {
  if (min !== undefined && value < min) {
    return min;
  }

  if (max !== undefined && value > max) {
    return max;
  }

  return value;
}
