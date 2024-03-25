import { assertType, describe, expect, expectTypeOf, it } from 'vitest';

import { keys } from './keys';
import { pipe } from './pipe';

describe('test for keys', () => {
  it('should return keys of array', () => {
    expect(keys(['x', 'y', 'z'])).toEqual(['0', '1', '2']);
  });

  it('should return keys of object', () => {
    expect(keys({ a: 'x', b: 'y', c: 'z' })).toEqual(['a', 'b', 'c']);
  });

  describe('strict', () => {
    it('should return strict types', () => {
      const actual = keys.strict({ 5: 'x', b: 'y', c: 'z' } as const);
      expect(actual).toEqual(['5', 'b', 'c']);

      assertType<Array<'5' | 'b' | 'c'>>(actual);
    });

    it('should work with Partial in pipe', () => {
      const data: Partial<{ bar?: number; foo: string }> = {
        bar: 7,
        foo: '1',
      };
      const actual = pipe(data, keys.strict);
      expect(actual).toEqual(['bar', 'foo']);

      assertType<Array<'bar' | 'foo'>>(actual);
    });
  });
});

describe('strict tuple types', () => {
  it('empty tuple', () => {
    const array: [] = [];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<typeof array>();
  });

  it('empty readonly tuple', () => {
    const array: readonly [] = [];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('array', () => {
    const array: Array<number> = [];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<Array<`${number}`>>();
  });

  it('readonly array', () => {
    const array: ReadonlyArray<number> = [];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<Array<`${number}`>>();
  });

  it('tuple', () => {
    const array: ['a', 1, true] = ['a', 1, true];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<['0', '1', '2']>();
  });

  it('readonly tuple', () => {
    const array: readonly ['a', 1, true] = ['a', 1, true];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<['0', '1', '2']>();
  });

  it('tuple with rest tail', () => {
    const array: ['a', ...Array<'b'>] = ['a'];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<['0', ...Array<`${number}`>]>();
  });

  it('readonly tuple with rest tail', () => {
    const array: readonly ['a', ...Array<'b'>] = ['a'];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<['0', ...Array<`${number}`>]>();
  });

  it('tuple with rest head', () => {
    const array: [...Array<'a'>, 'b'] = ['b'];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<[...Array<`${number}`>, `${number}`]>();
  });

  it('readonly tuple with rest head', () => {
    const array: readonly [...Array<'a'>, 'b'] = ['b'];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<[...Array<`${number}`>, `${number}`]>();
  });

  it('tuple with rest middle', () => {
    const array: ['a', ...Array<'b'>, 'c'] = ['a', 'c'];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<
      ['0', ...Array<`${number}`>, `${number}`]
    >();
  });

  it('readonly tuple with rest middle', () => {
    const array: readonly ['a', ...Array<'b'>, 'c'] = ['a', 'c'];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<
      ['0', ...Array<`${number}`>, `${number}`]
    >();
  });
});

describe('strict object types', () => {
  it('empty record (string)', () => {
    const obj: Record<string, never> = {};
    const result = keys.strict(obj);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('empty record (number)', () => {
    const obj: Record<number, never> = {};
    const result = keys.strict(obj);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('empty record (const)', () => {
    const obj = {} as const;
    const result = keys.strict(obj);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('simple (required) object', () => {
    const obj: { a: string; b: number; c: boolean } = { a: 'a', b: 1, c: true };
    const result = keys.strict(obj);
    expectTypeOf(result).toEqualTypeOf<Array<'a' | 'b' | 'c'>>();
  });

  it('simple partial object', () => {
    const obj: { a?: string; b?: number; c?: boolean } = {
      a: 'a',
      b: 1,
      c: true,
    };
    const result = keys.strict(obj);
    expectTypeOf(result).toEqualTypeOf<Array<'a' | 'b' | 'c'>>();
  });

  it('object with index signature', () => {
    const obj: { [keys: string]: string; a: string } = {
      a: 'goodbye',
      hello: 'world',
    };
    const result = keys.strict(obj);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  it('record with literal union', () => {
    const obj: Record<'a' | 'b', number> = { a: 1, b: 2 };
    const result = keys.strict(obj);
    expectTypeOf(result).toEqualTypeOf<Array<'a' | 'b'>>();
  });

  it('record with template string literal', () => {
    const obj: Record<`param_${number}`, string> = {
      param_123: 'hello',
      param_456: 'world',
    };
    const result = keys.strict(obj);
    expectTypeOf(result).toEqualTypeOf<Array<`param_${number}`>>();
  });
});
