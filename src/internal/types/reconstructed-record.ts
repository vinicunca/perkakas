import type { EnumerableStringKeyOf } from './enumerable-string-key-of';
import type { EnumerableStringKeyedValueOf } from './enumerable-string-keyed-value-of';

/**
 * This is the type you'd get from doing:
 * `Object.fromEntries(Object.entries(x))`.
 */
export type ReconstructedRecord<T> = Record<
  EnumerableStringKeyOf<T>,
  EnumerableStringKeyedValueOf<T>
>;
