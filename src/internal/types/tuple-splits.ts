import type { CoercedArray } from './coerced-array';
import type { IterableContainer } from './iterable-container';
import type { PartialArray } from './partial-array';
import type { PerkakasTypeError } from './perkakas-type-error';
import type { TupleParts } from './tuple-parts';

/**
 * The union of all possible ways to write a tuple as [...left, ...right].
 */
export type TupleSplits<T extends IterableContainer>
  // Use a distributive conditional type, in case T is a union.
  = T extends unknown
    // The complete set of all splits is the union of splitting each part of
    // the tuple individually.
    ? SplitPrefix<T> | SplitOptional<T> | SplitRest<T> | SplitSuffix<T>
    : never;

type SplitPrefix<T extends IterableContainer>
  // This distributes the union, which is needed to allow us to "iterate" over
  // the splits.
  = FixedTupleSplits<TupleParts<T>['required']> extends infer Req
    ? Req extends {
      left: infer Left;
      right: infer Right extends Array<unknown>;
    }
      ? {
          // For required part we take whatever the left split is, and we
          // reconstruct the rest of the array for the right side.
          left: Left;
          right: [
            ...Right,
            ...PartialArray<TupleParts<T>['optional']>,
            ...CoercedArray<TupleParts<T>['item']>,
            ...TupleParts<T>['suffix'],
          ];
        }
      : PerkakasTypeError<
        'SplitPrefix',
        'Unexpected result shape from FixedTupleSplits',
        { type: never; metadata: [Req, T] }
      >
    : never;

type SplitOptional<T extends IterableContainer>
  // This distributes the union, which is needed to allow us to "iterate" over
  // the splits.
  = FixedTupleSplits<TupleParts<T>['optional']> extends infer Optional
    ? Optional extends {
      left: infer Left extends Array<unknown>;
      right: infer Right extends Array<unknown>;
    }
      ? {
          // For optional part we need to add the required prefix to each left
          // side, we need to make the partial part partial, and we need to
          // reconstruct the rest of the tuple for the right side.
          left: [...TupleParts<T>['required'], ...PartialArray<Left>];
          right: [
            ...PartialArray<Right>,
            ...CoercedArray<TupleParts<T>['item']>,
            ...TupleParts<T>['suffix'],
          ];
        }
      : PerkakasTypeError<
        'SplitOptional',
        'Unexpected result shape from FixedTupleSplits',
        { type: never; metadata: [Optional, T] }
      >
    : never;

interface SplitRest<T extends IterableContainer> {
  // Splitting the rest element is easy, we only need to consider the split
  // happening "in the middle", which would cause the rest element to be n both
  // the right and left sides. For each side we simply put the parts of the
  // tuple that live in that part, for the left side it's the required and
  // optional prefixes, and for the right side it's the suffix.
  left: [
    ...TupleParts<T>['required'],
    ...PartialArray<TupleParts<T>['optional']>,
    ...CoercedArray<TupleParts<T>['item']>,
  ];
  right: [...CoercedArray<TupleParts<T>['item']>, ...TupleParts<T>['suffix']];
}

type SplitSuffix<T extends IterableContainer>
  // This distributes the union, which is needed to allow us to "iterate" over
  // the splits.
  = FixedTupleSplits<TupleParts<T>['suffix']> extends infer Suffix
    ? Suffix extends {
      left: infer Left extends Array<unknown>;
      right: infer Right;
    }
      ? {
          // Similar to the required prefix part, the suffix uses the right side
          // as-is, and reconstructs the left side with all the other parts of
          // the tuple.
          left: [
            ...TupleParts<T>['required'],
            ...PartialArray<TupleParts<T>['optional']>,
            ...CoercedArray<TupleParts<T>['item']>,
            ...Left,
          ];
          right: Right;
        }
      : PerkakasTypeError<
        'SplitSuffix',
        'Unexpected result shape from FixedTupleSplits',
        { type: never; metadata: [Suffix, T] }
      >
    : never;

type FixedTupleSplits<L, R extends Array<unknown> = []>
  = | { left: L; right: R }
    | (L extends readonly [...infer Head, infer Tail]
      ? FixedTupleSplits<Head, [Tail, ...R]>
      : never);
