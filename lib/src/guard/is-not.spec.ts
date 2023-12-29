import { assertType, describe, expect, it } from 'vitest';

import { typesDataProvider } from '../../test/types-data-provider';
import { isNot } from './is-not';
import { isPromise } from './is-promise';
import { isString } from './is-string';

describe('isNot', () => {
  it('isNot: should work as type guard', () => {
    const data = typesDataProvider('promise');
    if (isNot(isString)(data)) {
      expect(data instanceof Promise).toEqual(true);
      assertType<
        | (() => void)
        | {
            a: string;
          }
          | Array<number>
          | Date
          | Error
          | Promise<number>
          | boolean
          | null
          | number
          | undefined
          // TODO: fix this weird whitespace in @vinicunca/eslint-config
          >(data);
    }
  });
  it('isNot: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('promise'),
      typesDataProvider('array'),
      typesDataProvider('boolean'),
      typesDataProvider('function'),
    ];
    const result = data.filter(isNot(isPromise));
    expect(result.some((c) => c instanceof Promise)).toEqual(false);

    assertType<
    Array<
      | (() => void)
      | { a: string }
      | Array<number>
      | Date
      | Error
      | boolean
      | null
      | number
      | string
      | undefined
    >
        >(result);
  });
});
