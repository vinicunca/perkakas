import { assertType, describe, expect, it } from 'vitest';
import { typesDataProvider } from '../../test/types-data-provider';
import { isDefined } from './is-defined';

describe('isDefined', () => {
  it('isDefined": should work as type guard', () => {
    const data = typesDataProvider('date');
    if (isDefined(data)) {
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
      >(data,
        );
    }
  });

  it('isDefined: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('function'),
      typesDataProvider('null'),
      typesDataProvider('number'),
    ].filter(isDefined);
    expect(data).toHaveLength(4);
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
    >
    >(data,
      );
  });
});

describe('strict', () => {
  it('isDefined": should work as type guard', () => {
    const data = typesDataProvider('date');
    if (isDefined.strict(data)) {
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
      | null
      >(data,
        );
    }
  });
  it('isDefined: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('function'),
      typesDataProvider('null'),
      typesDataProvider('number'),
      typesDataProvider('undefined'),
    ].filter(isDefined.strict);
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
    | null
    >
    >(data,
      );
  });
});
