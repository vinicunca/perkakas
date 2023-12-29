import { assertType, describe, expect, it } from 'vitest';

import { typesDataProvider } from '../../test/types-data-provider';
import { isPromise } from './is-promise';

describe('isPromise', () => {
  it('isPromise: should work as type guard', () => {
    const data = typesDataProvider('promise');
    if (isPromise(data)) {
      expect(data instanceof Promise).toEqual(true);
      assertType<Promise<number>>(data);
    }
  });
  it('isPromise: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('promise'),
      typesDataProvider('array'),
      typesDataProvider('boolean'),
      typesDataProvider('function'),
    ].filter(isPromise);
    expect(data.every((c) => c instanceof Promise)).toEqual(true);
    assertType<Array<Promise<number>>>(data);
  });
});
