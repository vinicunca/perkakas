import { assertType, describe, expect, it } from 'vitest';

import { typesDataProvider } from '../../test/types-data-provider';
import { isNumber } from './is-number';

describe('isNumber', () => {
  it('isNumber: should work as type guard', () => {
    const data = typesDataProvider('number');
    if (isNumber(data)) {
      expect(typeof data).toEqual('number');
      assertType<number>(data);
    }
  });
  it('isNumber: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('promise'),
      typesDataProvider('array'),
      typesDataProvider('boolean'),
      typesDataProvider('function'),
      typesDataProvider('object'),
      typesDataProvider('number'),
    ].filter(isNumber);
    expect(data.every((c) => typeof c === 'number')).toEqual(true);
    assertType<Array<number>>(data);
  });
  it('should work even if data type is unknown', () => {
    const data: unknown = typesDataProvider('number');
    if (isNumber(data)) {
      expect(typeof data).toEqual('number');
      assertType<number>(data);
    }
  });
  it('should work with literal types', () => {
    const data = (): 1 | 2 | 3 | string => {
      return 1;
    };
    const x = data();
    if (isNumber(x)) {
      expect(typeof x).toEqual('number');
      assertType<1 | 2 | 3>(x);
    }
  });
});
