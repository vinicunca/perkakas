import { assertType, describe, expect, it } from 'vitest';
import { typesDataProvider } from '../../test/types-data-provider';
import { isArray } from './is-array';

describe('isArray', () => {
  it('isArray: should work as type guard', () => {
    const data = typesDataProvider('array');
    if (isArray(data)) {
      expect(Array.isArray(data)).toEqual(true);
      assertType<Array<number>>(data);
    }

    const data1: unknown = typesDataProvider('array');
    if (isArray(data1)) {
      assertType<ReadonlyArray<unknown>>(data1);
    }
  });

  it('isArray: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('function'),
      typesDataProvider('null'),
      typesDataProvider('array'),
      typesDataProvider('date'),
    ].filter(isArray);
    expect(data.every((c) => Array.isArray(c))).toEqual(true);
    assertType<Array<Array<number>>>(data);
  });
});
