import type { CoercedArray } from './coerced-array';
import type { IterableContainer } from './iterable-container';
import type { TupleParts } from './tuple-parts';

/**
 * The union of all possible ways to write a tuple as [...left, ...right].
 */
export type TupleSplits<Tuple extends IterableContainer> =
  // Use a distributive conditional type, in case T is a union:
  Tuple extends infer T
    ? TupleParts<T> extends {
      prefix: infer Prefix extends ReadonlyArray<unknown>;
      item: infer Item;
      suffix: infer Suffix extends ReadonlyArray<unknown>;
    }
      ?
      | FixedTupleSplits<Prefix, [...CoercedArray<Item>, ...Suffix]>
      | (FixedTupleSplits<Suffix> extends infer U
        ? U extends {
          left: infer L extends ReadonlyArray<unknown>;
          right: infer R;
        }
          ? { left: [...Prefix, ...CoercedArray<Item>, ...L]; right: R }
          : never
        : never)
      | {
        left: [...Prefix, ...CoercedArray<Item>];
        right: [...CoercedArray<Item>, ...Suffix];
      }
      : never
    : never;

/**
 * Helper type for `TupleSplits`, for tuples without rest params.
 */
type FixedTupleSplits<
  L extends IterableContainer,
  R extends IterableContainer = [],
> =
  | (L extends readonly []
    ? never
    : L extends readonly [...infer LHead, infer LTail]
      ? FixedTupleSplits<LHead, [LTail, ...R]>
      : L extends readonly [...infer LHead, (infer LTail)?]
        ? FixedTupleSplits<LHead, [LTail?, ...R]>
        : never)
      | { left: L; right: R };
