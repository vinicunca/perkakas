import { typesDataProvider } from '../../test/types-data-provider';
import { isString } from './is-string';
import { isNot } from './is-not';
import { isPromise } from './is-promise';

describe('isNot', () => {
  test('isNot: should work as type guard', () => {
    const data = typesDataProvider('promise');
    if (isNot(isString)(data)) {
      expect(data instanceof Promise).toEqual(true);
      assertType<
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
        | undefined
          >(data);
    }
  });
  test('isNot: should work as type guard in filter', () => {
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
        | boolean
        | string
        | { a: string }
        | (() => void)
        | Array<number>
        | Date
        | undefined
        | null
        | Error
        | number
      >
          >(result);
  });
});
