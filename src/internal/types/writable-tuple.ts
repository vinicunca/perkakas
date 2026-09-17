import type { CoercedArray } from './coerced-array';
import type { IterableContainer } from './iterable-container';
import type { PartialArray } from './partial-array';
import type { TupleParts } from './tuple-parts';

// TODO: Migrate all usages of type-fest's `Writable` to this one!
/**
 * Drop-in replacement for type-fest's `Writable` type (for arrays/tuples) that
 * retains the input's shape.
 */
export type WritableTuple<T extends IterableContainer>
  // We distribute the array type to support unions of arrays/tuples.
  = T extends unknown
    ? // This is exactly the array reconstruction from the TupleParts example.
      [
        ...TupleParts<T>['required'],
        ...PartialArray<TupleParts<T>['optional']>,
        ...CoercedArray<TupleParts<T>['item']>,
        ...TupleParts<T>['suffix'],
      ]
    : never;
