/**
 * ECMAScript doesn't support more decimal places than 15,
 * so supporting higher values doesn't make a lot of sense.
 * Considering Number.MAX_SAFE_INTEGER < 10**16
 * we can also use -15 for the negative precision limit.
 */
const MAX_PRECISION = 15;

export function withPrecision(roundingFn: (value: number) => number) {
  return (value: number, precision: number): number => {
    if (precision === 0) {
      return roundingFn(value);
    }

    if (!Number.isInteger(precision)) {
      throw new TypeError(`precision must be an integer: ${precision}`);
    }

    if (precision > MAX_PRECISION || precision < -MAX_PRECISION) {
      throw new RangeError('precision must be between -15 and 15');
    }

    if (Number.isNaN(value) || !Number.isFinite(value)) {
      return roundingFn(value);
    }

    const multiplier = 10 ** precision;
    return roundingFn(value * multiplier) / multiplier;
  };
}
