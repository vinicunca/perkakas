import { isNil, isNumber } from '../guard';

export function convertToUnit(
  str: string | number | null | undefined,
  unit = 'px',
): string | undefined {
  if (isNil(str) || str === '') {
    return undefined;
  } else if (Number.isNaN(+str!)) {
    return String(str);
  } else if (!Number.isFinite(+str!)) {
    return undefined;
  } else {
    return `${Number(str)}${unit}`;
  }
}

/**
 * Increase string a value with unit
 *
 * @example '2px' + 1 = '3px'
 * @example '15em' + (-2) = '13em'
 */
export function increaseWithUnit({ target, delta }: { target: string | number; delta: number }): string | number {
  if (isNumber(target)) {
    return target + delta;
  }

  const value = target.match(/^-?[0-9]+\.?[0-9]*/)?.[0] || '';
  const unit = target.slice(value.length);
  const result = (Number.parseFloat(value) + delta);

  if (Number.isNaN(result)) {
    return target;
  }

  return result + unit;
}

export function humanReadableFileSize(bytes: number, base: 1000 | 1024 = 1000): string {
  if (bytes < base) {
    return `${bytes} B`;
  }

  const prefix = base === 1024 ? ['Ki', 'Mi', 'Gi'] : ['k', 'M', 'G'];
  let unit = -1;

  while (Math.abs(bytes) >= base && unit < prefix.length - 1) {
    bytes /= base;
    ++unit;
  }

  return `${bytes.toFixed(1)} ${prefix[unit]}B`;
}

export function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
