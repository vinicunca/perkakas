// from https://github.com/ramda/ramda/blob/master/source/internal/_clone.js

function cloneRegExp_(pattern: RegExp): RegExp {
  return new RegExp(
    pattern.source,
    (pattern.global ? 'g' : '')
    + (pattern.ignoreCase ? 'i' : '')
    + (pattern.multiline ? 'm' : '')
    + (pattern.sticky ? 'y' : '')
    + (pattern.unicode ? 'u' : ''),
  );
}

function clone_(
  value: any,
  refFrom: Array<any>,
  refTo: Array<any>,
  deep: boolean,
): unknown {
  function copy(copiedValue: any): unknown {
    const len = refFrom.length;
    let idx = 0;
    while (idx < len) {
      if (value === refFrom[idx]) {
        return refTo[idx];
      }
      idx += 1;
    }
    refFrom[idx + 1] = value;
    refTo[idx + 1] = copiedValue;
    // eslint-disable-next-line no-restricted-syntax
    for (const key in value) {
      copiedValue[key] = deep
        ? clone_(value[key], refFrom, refTo, true)
        : value[key];
    }
    return copiedValue;
  }
  switch (type(value)) {
    case 'Object':
      return copy({});
    case 'Array':
      return copy([]);
    case 'Date':
      return new Date(value.valueOf());
    case 'RegExp':
      return cloneRegExp_(value);
    default:
      return value;
  }
}

/**
 * Creates a deep copy of the value. Supported types: `Array`, `Object`, `Number`, `String`, `Boolean`, `Date`, `RegExp`. Functions are assigned by reference rather than copied.
 *
 * @param value the object to clone
 * @category Object
 * @signature clone(value)
 * @example
 *  import { clone } from '@vinicunca/perkakas';
 *
 *  clone({foo: 'bar'}); // {foo: 'bar'}
 */
export function clone<T>(value: T): T {
  return value != null && typeof (value as any).clone === 'function'
    ? (value as any).clone()
    : clone_(value, [], [], true);
}

function type(val: unknown): string {
  if (val === null) {
    return 'Null';
  }

  if (val === undefined) {
    return 'Undefined';
  }

  return Object.prototype.toString.call(val).slice(8, -1);
}
