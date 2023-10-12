import { assertType, describe, expect, it } from 'vitest';
import { typesDataProvider } from '../../test/types-data-provider';
import { isDate } from './is-date';

describe('isDate', () => {
  it('isDate: should work as type guard', () => {
    const data = typesDataProvider('date');
    if (isDate(data)) {
      expect(data instanceof Date).toEqual(true);
      assertType<Date>(data);
    }

    const data1: unknown = typesDataProvider('date');
    if (isDate(data1)) {
      assertType<Date>(data1);
    }
  });

  it('isDate: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('function'),
      typesDataProvider('null'),
      typesDataProvider('number'),
      typesDataProvider('date'),
    ].filter(isDate);
    expect(data.every((c) => c instanceof Date)).toEqual(true);
    assertType<Array<Date>>(data);
  });
});
