import type { IterableContainer } from './iterable-container';
import type { TupleParts } from './tuple-parts';

/**
 * The first element of `T`, or `undefined` when `T` might be empty.
 */
export type First<T extends IterableContainer>
  // We distribute the array type to support unions of arrays/tuples.
  = T extends unknown
    ? TupleParts<T>['required'] extends readonly []
      ? | TupleParts<T>['optional'][number]
      | TupleParts<T>['item']
      | TupleParts<T>['suffix'][0]
      : TupleParts<T>['required'][0]
    : never;
