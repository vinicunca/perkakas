import type { AllTypesDataProviderTypes } from '../test/types-data-provider';
import { expectTypeOf, it } from 'vitest';
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isError } from './is-error';

class MyError extends Error {
  constructor() {
    super();
    this.name = 'MyError';
  }
}

it('should work as type guard', () => {
  const data = TYPES_DATA_PROVIDER.error as AllTypesDataProviderTypes;
  if (isError(data)) {
    expectTypeOf(data).toEqualTypeOf<Error>();
  }

  let maybeError: MyError | undefined;
  if (isError(maybeError)) {
    expectTypeOf(maybeError).toEqualTypeOf<MyError>();
  }
});

it('should work as type guard in filter', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isError);
  expectTypeOf(data).toEqualTypeOf<Array<Error>>();
});
