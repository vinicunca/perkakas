import type { AllTypesDataProviderTypes } from '../test/types-data-provider';
import { expectTypeOf, it } from 'vitest';
import {
  ALL_TYPES_DATA_PROVIDER,

  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isError } from './is-error';

class MyError extends Error {
  public constructor() {
    super();
    this.name = 'MyError';
  }
}

declare const MAYBE_ERROR: MyError | undefined;

it('should work as type guard', () => {
  const data = TYPES_DATA_PROVIDER.error as AllTypesDataProviderTypes;
  if (isError(data)) {
    expectTypeOf(data).toEqualTypeOf<Error>();
  }

  if (isError(MAYBE_ERROR)) {
    expectTypeOf(MAYBE_ERROR).toEqualTypeOf<MyError>();
  }
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isError);

  expectTypeOf(data).toEqualTypeOf<Array<Error>>();
});
