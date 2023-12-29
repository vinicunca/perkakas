import { assertType, describe, expect, it } from 'vitest';

import { typesDataProvider } from '../../test/types-data-provider';
import { isObject } from './is-object';

describe('isObject', () => {
  it('isObject: should work as type guard', () => {
    const data = typesDataProvider('object');
    if (isObject(data)) {
      expect(typeof data).toEqual('object');
      assertType<
        | {
          a: string;
        }
        | Date
        | Error
        | Promise<number>
      >(data);
    }
  });

  it('isObject: should work as type guard alt', () => {
    const data = { data: 5 } as { data: 5 } | ReadonlyArray<number>;
    if (isObject(data)) {
      expect(typeof data).toEqual('object');
      assertType<{
        data: 5;
      }>(data);
    }
  });

  it('isObject: should work as type guard for more narrow types', () => {
    const data = { data: 5 } as { data: number } | Array<number>;
    if (isObject(data)) {
      expect(typeof data).toEqual('object');
      assertType<{
        data: number;
      }>(data);
    }
  });

  it('should work even if data type is unknown', () => {
    const data: unknown = typesDataProvider('object');
    if (isObject(data)) {
      expect(typeof data).toEqual('object');
      assertType<Record<string, unknown>>(data);
    }
  });

  it('isObject: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('promise'),
      typesDataProvider('array'),
      typesDataProvider('boolean'),
      typesDataProvider('function'),
      typesDataProvider('object'),
    ].filter(isObject);
    expect(data.every((c) => typeof c === 'object' && !Array.isArray(c))).toEqual(
      true,
    );
    assertType<
    Array<
      | {
        a: string;
      }
      | Date
      | Error
      | Promise<number>
    >
    >(data);
  });
});
