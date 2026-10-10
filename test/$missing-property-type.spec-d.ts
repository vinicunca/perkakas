import type { $missingPropertyType } from './$missing-property-type';
import { expectTypeOf, it } from 'vitest';

// `toEqualTypeOf` can't tell `missing` apart from `undefined`, so we detect it
// via a relation that treats them differently: TypeScript strips `missing` from
// an inferred optional tuple element, but not from an array's items.
type HasMissingItems<T> = T extends readonly [(infer _Head)?, ...Array<unknown>]
  ? false
  : true;

it('produces the `missing` type', () => {
  // Tests using the helper pass vacuously when it stops producing `missing`
  // (e.g., when its return type is made explicit, or when TypeScript changes
  // how it handles `missing`).
  expectTypeOf<
    HasMissingItems<ReturnType<typeof $missingPropertyType>>
  >().toEqualTypeOf<true>();
});

it('detection doesn\'t flag a regular `undefined`', () => {
  expectTypeOf<
    HasMissingItems<Array<string | undefined>>
  >().toEqualTypeOf<false>();
});
