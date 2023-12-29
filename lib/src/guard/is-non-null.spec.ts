import { assertType, describe, expect, it } from 'vitest';

import { typesDataProvider } from '../../test/types-data-provider';
import { isNonNull } from './is-non-null';

describe('isNonNull', () => {
  it('isNonNull": should work as type guard', () => {
    const data = typesDataProvider('date');
    if (isNonNull(data)) {
      expect(data instanceof Date).toEqual(true);
      assertType<
        | (() => void)
        | { a: string }
        | Array<number>
        | Date
        | Error
        | Promise<number>
        | boolean
        | number
        | string
        | undefined
          >(data);
    }
  });
  it('isNonNull: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('function'),
      typesDataProvider('null'),
      typesDataProvider('number'),
      typesDataProvider('undefined'),
    ].filter(isNonNull);
    expect(data).toHaveLength(5);
    assertType<
    Array<
      | (() => void)
      | {
        a: string;
      }
      | Array<number>
      | Date
      | Error
      | Promise<number>
      | boolean
      | number
      | string
      | undefined
    >
        >(data);
  });
});
