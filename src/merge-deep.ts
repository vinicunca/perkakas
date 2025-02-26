import type { MergeDeep } from 'type-fest';

import { curry } from './curry';
import { isPlainObject } from './is-plain-object';

/**
 * Merges the `source` object into the `destination` object. The merge is similar to performing `{ ...destination, ... source }` (where disjoint values from each object would be copied as-is, and for any overlapping props the value from `source` would be used); But for *each prop* (`p`), if **both** `destination` and `source` have a **plain-object** as a value, the value would be taken as the result of recursively deepMerging them (`result.p === deepMerge(destination.p, source.p)`).
 *
 * @param destination - The object to merge into. In general, this object would have it's values overridden.
 * @param source - The object to merge from. In general, shared keys would be taken from this object.
 * @returns The merged object.
 * @signature
 *    P.mergeDeep(destination, source)
 * @example
 *    P.mergeDeep({ foo: 'bar', x: 1 }, { foo: 'baz', y: 2 }) // => { foo: 'baz', x: 1, y: 2 }
 * @dataFirst
 * @category Object
 */
export function mergeDeep<Destination extends object, Source extends object>(
  destination: Destination, source: Source
): MergeDeep<Destination, Source>;

/**
 * Merges the `source` object into the `destination` object. The merge is similar to performing `{ ...destination, ... source }` (where disjoint values from each object would be copied as-is, and for any overlapping props the value from `source` would be used); But for *each prop* (`p`), if **both** `destination` and `source` have a **plain-object** as a value, the value would be taken as the result of recursively deepMerging them (`result.p === deepMerge(destination.p, source.p)`).
 *
 * @param source - The object to merge from. In general, shared keys would be taken from this object.
 * @returns The merged object.
 * @signature
 *    P.mergeDeep(source)(destination)
 * @example
 *    P.pipe(
 *      { foo: 'bar', x: 1 },
 *      P.mergeDeep({ foo: 'baz', y: 2 }),
 *    );  // => { foo: 'baz', x: 1, y: 2 }
 * @dataLast
 * @category Object
 */
export function mergeDeep<Source extends object>(
  source: Source,
): <Destination extends object>(
  target: Destination,
) => MergeDeep<Destination, Source>;

export function mergeDeep(...args: ReadonlyArray<unknown>): unknown {
  return curry(mergeDeepImplementation, args);
}

function mergeDeepImplementation<
  Destination extends object,
  Source extends object,
>(destination: Destination, source: Source): MergeDeep<Destination, Source> {
  // At this point the output is already merged, simply not deeply merged.
  const output = { ...destination, ...source } as Record<
    keyof Destination | keyof Source,
    unknown
  >;

  // now just scan the output and look for values that should have been deep-merged
  // eslint-disable-next-line no-restricted-syntax
  for (const key in source) {
    if (!(key in destination)) {
      // They don't share this key.
      continue;
    }

    const { [key]: destinationValue } = destination;
    if (!isPlainObject(destinationValue)) {
      // The value in destination is not a mergable object so the value from
      // source (which was already copied in the shallow merge) would be used
      // as-is.
      continue;
    }

    const { [key]: sourceValue } = source;
    if (!isPlainObject(sourceValue)) {
      // The value in source is not a mergable object either, so it will
      // override the object in destination.
      continue;
    }

    // Both destination and source have a mergable object for this key, so we
    // recursively merge them.
    output[key] = mergeDeepImplementation(destinationValue, sourceValue);
  }

  // @ts-expect-error [ts2322] - We build the output object iteratively, I don't think it's possible to improve the types here so that typescript infers the right type.
  return output;
}
