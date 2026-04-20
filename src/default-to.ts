import type { IsEqual } from 'type-fest';
import type { PerkakasTypeError } from './internal/types/perkakas-type-error';
import { curry } from './curry';

type FallbackOf<T>
  = IsEqual<T, NonNullable<T>> extends true
    ? PerkakasTypeError<
      'defaultTo',
      'no unnecessary fallback',
      // The type is `never` because it will never be used ;)
      { type: never; metadata: T }
    >
    : T;

/**
 * A stricter wrapper around the [Nullish coalescing operator `??`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)
 * that ensures that the fallback matches the type of the data. Only works
 * when data can be `null` or `undefined`.
 *
 * Notice that `Number.NaN` is not nullish and would not result in returning the
 * fallback!
 *
 * @param data - A nullish value.
 * @param fallback - A value of the same type as `data` that would be returned
 * when `data` is nullish.
 * @signature
 *   defaultTo(data, fallback);
 * @example
 *   defaultTo("hello" as string | undefined, "world"); //=> "hello"
 *   defaultTo(undefined as string | undefined, "world"); //=> "world"
 * @dataFirst
 * @category Other
 */
export function defaultTo<T, const Fallback extends FallbackOf<T>>(
  data: T,
  fallback: Fallback,
): NonNullable<T> | Fallback;

/**
 * A stricter wrapper around the [Nullish coalescing operator `??`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)
 * that ensures that the fallback matches the type of the data, and that the
 * data is nullish (`null` or `undefined`).
 *
 * Notice that `Number.NaN` is not nullish and would not result in returning the
 * fallback!
 *
 * @param fallback - A value of the same type as `data` that would be returned
 * when `data` is nullish.
 * @signature
 *   defaultTo(fallback)(data);
 * @example
 *   pipe("hello" as string | undefined, defaultTo("world")); //=> "hello"
 *   pipe(undefined as string | undefined, defaultTo("world")); //=> "world"
 * @dataLast
 * @category Other
 */
export function defaultTo<T, const Fallback extends FallbackOf<T>>(
  fallback: Fallback,
): (data: T) => NonNullable<T> | Fallback;

export function defaultTo(...args: ReadonlyArray<unknown>): unknown {
  return curry(defaultToImplementation, args);
}

function defaultToImplementation<T, Fallback extends FallbackOf<T>>(data: T, fallback: Fallback): NonNullable<T> | Fallback {
  return data ?? fallback;
}
