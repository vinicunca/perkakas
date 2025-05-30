/**
 * ECMAScript doesn't support more decimal places than 15,
 * so supporting higher values doesn't make a lot of sense.
 * Considering Number.MAX_SAFE_INTEGER < 10**16
 * we can also use -15 for the negative precision limit.
 */
const MAX_PRECISION = 15;

const RADIX = 10;

export function withPrecision(roundingFn: (value: number) => number) {
  return (value: number, precision: number): number => {
    if (precision === 0) {
      return roundingFn(value);
    }

    if (!Number.isInteger(precision)) {
      throw new TypeError(
        `precision must be an integer: ${precision.toString()}`,
      );
    }

    if (precision > MAX_PRECISION || precision < -MAX_PRECISION) {
      throw new RangeError('precision must be between -15 and 15');
    }

    if (Number.isNaN(value) || !Number.isFinite(value)) {
      return roundingFn(value);
    }

    if (precision > 0) {
      const multiplier = RADIX ** precision;
      return roundingFn(value * multiplier) / multiplier;
    }

    // Avoid losing precision by dividing first.
    const divisor = RADIX ** -precision;
    return roundingFn(value / divisor) * divisor;
  };
}
