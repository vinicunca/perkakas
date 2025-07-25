import { curry } from './curry';

/**
 * Creates a deep copy of the value. Supported types: [plain objects](#isPlainObject),
 * `Array`, `number`, `string`, `boolean`, `Date`, and `RegExp`. Functions are
 * assigned by reference rather than copied. Class instances or any other
 * built-in type that isn't mentioned above are not supported (but might
 * work).
 *
 * @param data - The object to clone.
 * @signature
 *   P.clone(data)
 * @example
 *   P.clone({foo: 'bar'}) // {foo: 'bar'}
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
 *   P.clone()(data)
 * @example
 *   P.pipe({foo: 'bar'}, P.clone()) // {foo: 'bar'}
 * @dataLast
 * @category Object
 */
export function clone(): <T>(data: T) => T;

export function clone(...args: ReadonlyArray<unknown>): unknown {
  return curry(cloneImplementation, args);
}

function cloneImplementation<T>(
  value: T,
  refFrom: Array<unknown> = [],
  refTo: Array<unknown> = [],
): T {
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
    !Array.isArray(value)
    // Keep this check in sync with the same check in the impl of
    // `isPlainObject`.
    && prototype !== null
    && prototype !== Object.prototype
  ) {
    // Our cloning logic is only designed for plain objects and arrays; other
    // object types (like `Date`, `RegExp`, `File`, and user-defined classes)
    // wouldn't clone properly. We fallback to the native cloning for them.
    return structuredClone(value);
  }

  /**
   * In order to support cyclic/self-referential structures,
   * and to support functions _within_ objects,
   * we need to have our own cloning logic.
   */

  // First we check if we've already cloned this value.
  const idx = refFrom.indexOf(value);
  if (idx >= 0) {
    return refTo[idx] as T;
  }
  /**
   * And if we haven't, we add it to our list of seen values so that it is kept
   * and clone the deep structure.
   */
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

  /**
   * It's important to first push the cloned ref so that it's index is kept in
   * sync with the ref to the original value in refFrom.
   */
  refTo.push(copiedValue);

  for (const [k, v] of Object.entries(value)) {
    copiedValue[k] = cloneImplementation(v, refFrom, refTo);
  }

  return copiedValue as T;
}

function deepCloneArray<T extends ReadonlyArray<unknown>>(
  value: T,
  refFrom: Array<unknown>,
  refTo: Array<unknown>,
): T {
  const copiedValue: Array<unknown> = [];

  /**
   * It's important to first push the cloned ref so that it's index is kept in
   * sync with the ref to the original value in refFrom.
   */
  refTo.push(copiedValue);

  for (const [index, item] of value.entries()) {
    copiedValue[index] = cloneImplementation(item, refFrom, refTo);
  }

  return copiedValue as unknown as T;
}
