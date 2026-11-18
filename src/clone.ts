/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types --
 * The state needed to compute the clone is passed by reference via mutable
 * arrays.
 */

import { curry1 } from './internal/curry-by-arity';

/**
 * Creates a deep copy of the value. Supported types: [plain objects](#isPlainObject),
 * `Array`, `number`, `string`, `boolean`, `Date`, and `RegExp`. Functions are
 * assigned by reference rather than copied. Class instances or any other
 * built-in type that isn't mentioned above are not supported (but might
 * work).
 *
 * @param data - The object to clone.
 * @signature
 *   clone(data)
 * @example
 *   clone({foo: 'bar'}) // {foo: 'bar'}
 * @dataFirst
 * @category Object
 */
export function clone<T>(data: T): T;

/**
 * Creates a deep copy of the value. Supported types: [plain objects](#isPlainObject),
 * `Array`, `number`, `string`, `boolean`, `Date`, and `RegExp`. Functions are
 * assigned by reference rather than copied. Class instances or any other
 * built-in type that isn't mentioned above are not supported (but might
 * work).
 *
 * @signature
 *   clone()(data)
 * @example
 *   pipe({foo: 'bar'}, clone()) // {foo: 'bar'}
 * @dataLast
 * @category Object
 */
export function clone(): <T>(data: T) => T;

export function clone(data?: unknown): unknown {
  return curry1(cloneImplementation, arguments.length, data);
}

// A thin wrapper so `Function.length` is 1 (no defaulted params). That lets
// `curry` treat a single-argument call as data-first.
function cloneImplementation<T>(value: T): T {
  return cloneValue(value, [], []);
}

function cloneValue<T>(value: T, refFrom: Array<unknown>, refTo: Array<unknown>): T {
  if (typeof value === 'function') {
    // Functions aren't cloned, we return the same instance.
    return value;
  }

  if (typeof value !== 'object' || value === null) {
    // Only objects are interesting when cloning, everything else can use
    // whatever JS does by default.
    return structuredClone(value);
  }

  const prototype = Object.getPrototypeOf(value);
  if (
    // Keep this check in sync with the same check in the impl of
    // `isPlainObject`.
    prototype !== null
    && prototype !== Object.prototype
    && !Array.isArray(value)
  ) {
    // Our cloning logic is only designed for plain objects and arrays; other
    // object types (like `Date`, `RegExp`, `File`, and user-defined classes)
    // wouldn't clone properly. We fallback to the native cloning for them.
    return structuredClone(value);
  }

  // In order to support cyclic/self-referential structures, and to support
  // functions _within_ objects, we need to have our own cloning logic.

  // First we check if we've already cloned this value.
  const idx = refFrom.indexOf(value);
  if (idx !== -1) {
    return refTo[idx] as T;
  }
  // And if we haven't, we add it to our list of seen values so that it is kept
  // and clone the deep structure.
  refFrom.push(value);
  return Array.isArray(value)
    ? deepCloneArray(value, refFrom, refTo)
    : deepCloneObject(value, refFrom, refTo);
}

function deepCloneObject<T extends object>(
  value: T,
  refFrom: Array<unknown>,
  refTo: Array<unknown>,
): T {
  const copiedValue: Record<PropertyKey, unknown> = {};

  // It's important to first push the cloned ref so that it's index is kept in
  // sync with the ref to the original value in refFrom.
  refTo.push(copiedValue);

  for (const entry of Object.entries(value)) {
    const clonedValue: unknown = cloneValue(entry[1], refFrom, refTo);

    const key = entry[0];
    if (key === '__proto__') {
      // We want `__proto__` to act just like any other key, but assigning it
      // runs the setter inherited from `Object.prototype` instead of creating
      // a property. Defining it directly creates the same own data property
      // that assigning creates for all *other* keys.
      Object.defineProperty(copiedValue, '__proto__', {
        value: clonedValue,
        configurable: true,
        enumerable: true,
        writable: true,
      });
    } else {
      copiedValue[key] = clonedValue;
    }
  }

  return copiedValue as T;
}

function deepCloneArray<T extends ReadonlyArray<unknown>>(
  value: T,
  refFrom: Array<unknown>,
  refTo: Array<unknown>,
): T {
  const copiedValue: Array<unknown> = [];

  // It's important to first push the cloned ref so that it's index is kept in
  // sync with the ref to the original value in refFrom.
  refTo.push(copiedValue);

  for (const item of value) {
    copiedValue.push(cloneValue(item, refFrom, refTo));
  }

  // eslint-disable-next-line slop/no-chained-type-assertions
  return copiedValue as unknown as T;
}
