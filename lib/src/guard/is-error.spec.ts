import { assertType, describe, expect, it } from 'vitest';

import { typesDataProvider } from '../../test/types-data-provider';
import { isError } from './is-error';

describe('isError', () => {
  it('isError: should work as type guard', () => {
    const data = typesDataProvider('error');
    if (isError(data)) {
      expect(data instanceof Error).toEqual(true);
      assertType<Error>(data);
    }

    class MyError extends Error {}

    let maybeError: MyError | undefined;
    if (isError(maybeError)) {
      assertType<MyError>(maybeError);
    }
  });
  it('isError: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('boolean'),
      typesDataProvider('function'),
      typesDataProvider('object'),
      typesDataProvider('number'),
    ].filter(isError);
    expect(data.every((c) => c instanceof Error)).toEqual(true);
    assertType<Array<Error>>(data);
  });
});
