import {
  ALL_TYPES_DATA_PROVIDER,
  type AllTypesDataProviderTypes,
  TYPES_DATA_PROVIDER,
  TestClass,
} from '../test/types-data-provider';
import { isObjectType } from './is-object-type';

describe('runtime', () => {
  it('accepts simple objects', () => {
    expect(isObjectType({ a: 123 })).toEqual(true);
  });

  it('accepts trivial empty objects', () => {
    expect(isObjectType({})).toEqual(true);
  });

  it('rejects strings', () => {
    expect(isObjectType('asd')).toEqual(false);
  });

  it('rejects null', () => {
    expect(isObjectType(null)).toEqual(false);
  });

  it('accepts arrays', () => {
    expect(isObjectType([1, 2, 3])).toEqual(true);
  });

  it('accepts classes', () => {
    expect(isObjectType(new TestClass())).toEqual(true);
  });

  it('accepts null prototypes', () => {
    expect(isObjectType(Object.create(null))).toEqual(true);
  });

  it('aLL_TYPES_DATA_PROVIDER', () => {
    expect(ALL_TYPES_DATA_PROVIDER.filter(isObjectType)).toMatchInlineSnapshot(`
      [
        [
          1,
          2,
          3,
        ],
        1985-07-24T07:40:00.000Z,
        [Error: asd],
        TestClass {},
        Map {},
        {
          "a": "asd",
        },
        Promise {},
        /test/gu,
        Set {},
        [
          1,
          2,
          3,
        ],
        Uint8Array [
          0,
        ],
      ]
    `);
  });
});

describe('typing', () => {
  it('narrows nullable types', () => {
    const data: { a: string } | null = { a: 'hello' };
    if (isObjectType(data)) {
      expectTypeOf(data).toEqualTypeOf<{ a: string }>();
    }
  });

  it('should work as type guard', () => {
    const data = TYPES_DATA_PROVIDER.object as AllTypesDataProviderTypes;
    if (isObjectType(data)) {
      expectTypeOf(data).toEqualTypeOf<
        | Array<number>
        | Date
        | Error
        | Map<string, string>
        | Promise<number>
        | RegExp
        | Set<string>
        | TestClass
        | Uint8Array
        | (() => void)
        | { readonly a: 'asd' }
        | [number, number, number]
      >();
    }
  });

  it('should work even if data type is unknown', () => {
    const data = TYPES_DATA_PROVIDER.object as unknown;
    if (isObjectType(data)) {
      expectTypeOf(data).toEqualTypeOf<object>();
    }
  });

  it('should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isObjectType);
    expectTypeOf(data).toEqualTypeOf<
      Array<
        | Array<number>
        | Date
        | Error
        | Map<string, string>
        | Promise<number>
        | RegExp
        | Set<string>
        | TestClass
        | Uint8Array
        | (() => void)
        | { readonly a: 'asd' }
        | [number, number, number]
      >
    >();
  });

  it('can narrow down `any`', () => {
    // eslint-disable-next-line ts/no-explicit-any -- Explicitly testing `any`
    const data = { hello: 'world' } as any;
    if (isObjectType(data)) {
      expectTypeOf(data).toEqualTypeOf<object>();
    }
  });
});
