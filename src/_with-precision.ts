/**
 * ECMAScript doesn't support more decimal places than 15
 */
const MAX_PRECISION = 15;

export function _withPrecision(roundingFn: (value: number) => number) {
  return (value: number, precision: number): number => {
    if (precision === 0) {
      return roundingFn(value);
    }

    if (!Number.isInteger(precision)) {
      throw new TypeError(`precision must be an integer: ${precision}`);
    }

    if (precision > MAX_PRECISION || precision < -MAX_PRECISION) {
      throw new RangeError(`precision must be between ${-MAX_PRECISION} and ${MAX_PRECISION}`);
    }

    if (Number.isNaN(value) || !Number.isFinite(value)) {
      return roundingFn(value);
    }

    const multiplier = 10 ** precision;

    return roundingFn(value * multiplier) / multiplier;
  };
}
