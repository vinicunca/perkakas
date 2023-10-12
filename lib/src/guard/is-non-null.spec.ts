import { assertType, describe, expect, it } from 'vitest';
import { typesDataProvider } from '../../test/types-data-provider';
import { isNonNull } from './is-non-null';

describe('isNonNull', () => {
  it('isNonNull": should work as type guard', () => {
    const data = typesDataProvider('date');
    if (isNonNull(data)) {
      expect(data instanceof Date).toEqual(true);
      assertType<
      | boolean
      | string
      | { a: string }
      | (() => void)
      | Array<number>
      | Date
      | Error
      | number
      | Promise<number>
      | undefined
        >(data,
        );
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
    | string
    | number
    | boolean
    | {
      a: string;
    }
    | (() => void)
    | Array<number>
    | Date
    | Error
    | Promise<number>
    | undefined
    >
      >(data,
      );
  });
});
