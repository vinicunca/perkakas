import { purry } from '../function';

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
export function clamp(
  value: number,
  limits: { max?: number; min?: number }
): number;

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
export function clamp(limits: {
  max?: number;
  min?: number;
}): (value: number) => number;

export function clamp(...args: any[]) {
  return purry(_clamp, args);
}

function _clamp(value: number, limits: { max?: number; min?: number }) {
  if (limits.min != null && limits.min > value) {
    return limits.min;
  }

  if (limits.max != null && limits.max < value) {
    return limits.max;
  }

  return value;
}
