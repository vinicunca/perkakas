import { assertType, describe, expect, it } from 'vitest';

import { typesDataProvider } from '../../test/types-data-provider';
import { isFunction } from './is-function';

describe('isFunction', () => {
  it('isFunction: should work as type guard', () => {
    const data = typesDataProvider('null');
    if (isFunction(data)) {
      expect(data).toEqual(null);
      assertType<() => void>(data);
    }

    let maybeFunction: ((a: number) => string) | string | undefined;
    if (isFunction(maybeFunction)) {
      maybeFunction(1);
      assertType<(a: number) => string>(maybeFunction);
    }
  });
  it('isFunction: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('function'),
      typesDataProvider('function'),
      typesDataProvider('object'),
      typesDataProvider('number'),
    ].filter(isFunction);
    expect(data.every((c) => typeof c === 'function')).toEqual(true);
    assertType<Array<() => void>>(data);
  });
});
