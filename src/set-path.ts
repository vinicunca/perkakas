import type { ValueOf } from 'type-fest';
import type { PerkakasTypeError } from './internal/types/perkakas-type-error';
import { curry } from './curry';

type Paths<T, Prefix extends ReadonlyArray<unknown> = []>
  = | Prefix
    | (T extends object
      ? ValueOf<{
        [K in ProperKeyOf<T>]-?: Paths<T[K], [...Prefix, K]>;
      }>
      : PerkakasTypeError<
          'setPath',
          'Can only compute paths objects',
          { type: never; metadata: T }
        >) extends infer Path
    // The Paths type is used to define the path param in `setPath`. In order
    // for both mutable arrays and readonly arrays to be supported we need to
    // make all results `readonly` (because mutable arrays extend readonly
    // arrays, but not the other way around). Because the result of Paths is
    // a union of arrays we need to distribute Result so that the operator is
    // applied to each member separately.
    ? Readonly<Path>
    : never;

/**
 * Array objects have all Array.prototype keys in their "keyof" type, which
 * is not what we'd expect from the operator. We only want the numeric keys
 * which represent proper elements of the array.
 */
type ProperKeyOf<T> = Extract<
  keyof T,
  T extends ReadonlyArray<unknown> ? number : keyof T
>;

type ValueAtPath<T, Path> = Path extends readonly [
  infer Head extends keyof T,
  ...infer Rest,
]
  ? ValueAtPath<T[Head], Rest>
  : T;

/**
 * Sets the value at `path` of `object`.
 *
 * For simple cases where the path is only one level deep, prefer `set` instead.
 *
 * @param data - The target method.
 * @param path - The array of properties.
 * @param value - The value to set.
 * @signature
 *    P.setPath(obj, path, value)
 * @example
 *    P.setPath({ a: { b: 1 } }, ['a', 'b'], 2) // => { a: { b: 2 } }
 * @dataFirst
 * @category Object
 */
export function setPath<T, Path extends Paths<T>>(
  data: T,
  path: Path,
  value: ValueAtPath<T, Path>,
): T;

/**
 * Sets the value at `path` of `object`.
 *
 * @param path - The array of properties.
 * @param value - The value to set.
 * @signature
 *    P.setPath(path, value)(obj)
 * @example
 *    P.pipe({ a: { b: 1 } }, P.setPath(['a', 'b'], 2)) // { a: { b: 2 } }
 * @dataLast
 * @category Object
 */
export function setPath<
  T,
  Path extends Paths<T>,
  // TODO [>2] -- TODO: The following eslint is solvable by inlining Value and wrapping the T parameter with `NoInfer` (e.g. `ValueAtPath<NoInfer<T>, TPath>); to prevent typescript from inferring it as `unknown`. This is only available in TS 5.4, which is above what we currently support (5.1).
  Value extends ValueAtPath<T, Path>,
>(path: Path, value: Value): (data: T) => T;

export function setPath(...args: ReadonlyArray<unknown>): unknown {
  return curry(setPathImplementation, args);
}

function setPathImplementation(
  data: unknown,
  path: ReadonlyArray<PropertyKey>,
  value: unknown,
): unknown {
  const [pivot, ...rest] = path;
  if (pivot === undefined) {
    return value;
  }

  if (Array.isArray(data)) {
    const copy = [...data];
    copy[pivot as number] = setPathImplementation(
      data[pivot as number],
      rest,
      value,
    );
    return copy;
  }

  const { [pivot]: currentValue, ...remaining } = data as Record<
    PropertyKey,
    unknown
  >;

  return {
    ...remaining,
    [pivot]: setPathImplementation(currentValue, rest, value),
  };
}
