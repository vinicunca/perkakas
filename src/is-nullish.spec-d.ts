import type { IsEqual, IsUnknown, Or } from 'type-fest';
import { expectTypeOf, it } from 'vitest';
import {
  ALL_TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isNullish } from './is-nullish';

it('narrows nulls', () => {
  const data = 123 as number | null;
  if (isNullish(data)) {
    expectTypeOf(data).toBeNull();
  } else {
    expectTypeOf(data).toBeNumber();
  }
});

it('narrows undefined', () => {
  const data = 123 as number | undefined;
  if (isNullish(data)) {
    expectTypeOf(data).toBeUndefined();
  } else {
    expectTypeOf(data).toBeNumber();
  }
});

it('narrows on both', () => {
  const data = 123 as number | null | undefined;
  if (isNullish(data)) {
    expectTypeOf(data).toEqualTypeOf<null | undefined>();
  } else {
    expectTypeOf(data).toBeNumber();
  }
});

it('doesn\'t narrow non-nullables', () => {
  const data = 123;
  if (isNullish(data)) {
    expectTypeOf(data).toBeNever();
  } else {
    expectTypeOf(data).toBeNumber();
  }
});

it('narrows unknowns', () => {
  const data = 123 as unknown;
  if (isNullish(data)) {
    expectTypeOf(data).toEqualTypeOf<null | undefined>();
  } else {
    expectTypeOf(
      true as Or<
        // Since TypeScript 5.8 the type is narrowed in the else branch.
        IsEqual<typeof data, NonNullable<unknown>>,
        // Previous versions couldn't do that and kept the type as `unknown`.
        IsUnknown<typeof data>
      >,
    ).toEqualTypeOf<true>();
  }
});

it('narrows any', () => {
  // eslint-disable-next-line ts/no-explicit-any
  const data = 123 as any;
  if (isNullish(data)) {
    expectTypeOf(data).toEqualTypeOf<null | undefined>();
  } else {
    expectTypeOf(data).toBeAny();
  }
});

it('doesn\'t expand narrow types', () => {
  const data = 'cat' as 'cat' | 'dog' | null | undefined;
  if (isNullish(data)) {
    expectTypeOf(data).toEqualTypeOf<null | undefined>();
  } else {
    expectTypeOf(data).toEqualTypeOf<'cat' | 'dog'>();
  }
});

it('should work as type guard in filter', () => {
  const result = ALL_TYPES_DATA_PROVIDER.filter(isNullish);
  expectTypeOf(result).toEqualTypeOf<Array<null | undefined>>();
});
