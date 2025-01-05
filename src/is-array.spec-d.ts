import {
  ALL_TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isArray } from './is-array';

it('should infer ReadonlyArray<unknown> when given any', () => {
  // eslint-disable-next-line ts/no-explicit-any -- Explicitly testing `any`
  const data = [] as any;
  if (isArray(data)) {
    expectTypeOf(data).not.toBeAny();
    expectTypeOf(data[0]).toBeUnknown();
  }
});

it('should work as type guard', () => {
  const data = TYPES_DATA_PROVIDER.array as AllTypesDataProviderTypes;
  if (isArray(data)) {
    expectTypeOf(data).toEqualTypeOf<
      Array<number> | [number, number, number]
    >();
  }
});

it('should infer ReadonlyArray<unknown> when given `unknown`', () => {
  const data = TYPES_DATA_PROVIDER.array as unknown;
  if (isArray(data)) {
    expectTypeOf(data).toEqualTypeOf<ReadonlyArray<unknown>>();
  }
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isArray);
  expectTypeOf(data).toEqualTypeOf<
    Array<Array<number> | [number, number, number]>
  >();
});

test('mutable arrays work', () => {
  const data = [] as Array<number> | string;

  if (isArray(data)) {
    expectTypeOf(data).toEqualTypeOf<Array<number>>();
  }

  expectTypeOf([data].filter(isArray)).toEqualTypeOf<Array<Array<number>>>();
});

test('readonly arrays work', () => {
  const data = [] as ReadonlyArray<number> | string;

  if (isArray(data)) {
    expectTypeOf(data).toEqualTypeOf<ReadonlyArray<number>>();
  }

  expectTypeOf([data].filter(isArray)).toEqualTypeOf<
    Array<ReadonlyArray<number>>
  >();
});
