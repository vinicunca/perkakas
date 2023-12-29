import { assertType, describe, expect, it } from 'vitest';

import { typesDataProvider } from '../../test/types-data-provider';
import { isNil } from './is-nil';

describe('isNil', () => {
  it('isNil: should work as type guard', () => {
    const data = typesDataProvider('null');
    if (isNil(data)) {
      expect(data).toEqual(null);
      assertType<null | undefined>(data);
    }
  });
  it('isNil: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('function'),
      typesDataProvider('function'),
      typesDataProvider('null'),
      typesDataProvider('number'),
    ].filter(isNil);
    expect(data.every((c) => c == null)).toEqual(true);
    assertType<Array<null | undefined>>(data);
  });
});
