import { describe, expectTypeOf, it } from 'vitest';
import { keys } from './keys';
import { pipe } from './pipe';

describe('arrays', () => {
  it('empty tuple', () => {
    const result = keys([] as []);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('empty readonly tuple', () => {
    const result = keys([] as const);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('array', () => {
    const result = keys([] as Array<number>);
    expectTypeOf(result).toEqualTypeOf<Array<`${number}`>>();
  });

  it('readonly array', () => {
    const result = keys([] as ReadonlyArray<number>);
    expectTypeOf(result).toEqualTypeOf<Array<`${number}`>>();
  });

  it('tuple', () => {
    const result = keys(['a', 1, true] as ['a', 1, true]);
    expectTypeOf(result).toEqualTypeOf<['0', '1', '2']>();
  });

  it('readonly tuple', () => {
    const result = keys(['a', 1, true] as const);
    expectTypeOf(result).toEqualTypeOf<['0', '1', '2']>();
  });

  it('tuple with rest tail', () => {
    const result = keys(['a'] as ['a', ...Array<'b'>]);
    expectTypeOf(result).toEqualTypeOf<['0', ...Array<`${number}`>]>();
  });

  it('readonly tuple with rest tail', () => {
    const result = keys(['a'] as readonly ['a', ...Array<'b'>]);
    expectTypeOf(result).toEqualTypeOf<['0', ...Array<`${number}`>]>();
  });

  it('tuple with rest head', () => {
    const result = keys(['b'] as [...Array<'a'>, 'b']);
    expectTypeOf(result).toEqualTypeOf<[...Array<`${number}`>, `${number}`]>();
  });

  it('readonly tuple with rest head', () => {
    const result = keys(['b'] as readonly [...Array<'a'>, 'b']);
    expectTypeOf(result).toEqualTypeOf<[...Array<`${number}`>, `${number}`]>();
  });

  it('tuple with rest middle', () => {
    const result = keys(['a', 'c'] as ['a', ...Array<'b'>, 'c']);
    expectTypeOf(result).toEqualTypeOf<
      ['0', ...Array<`${number}`>, `${number}`]
    >();
  });

  it('readonly tuple with rest middle', () => {
    const result = keys(['a', 'c'] as readonly ['a', ...Array<'b'>, 'c']);
    expectTypeOf(result).toEqualTypeOf<
      ['0', ...Array<`${number}`>, `${number}`]
    >();
  });
});

describe('object types', () => {
  it('empty record (string)', () => {
    const result = keys({} as Record<string, never>);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('empty record (number)', () => {
    const result = keys({} as Record<number, never>);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('empty record (const)', () => {
    const result = keys({} as const);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('unions of records', () => {
    const data = {} as Record<number, unknown> | Record<string, unknown>;

    const dataFirst = keys(data);
    expectTypeOf(dataFirst).toEqualTypeOf<Array<`${number}`> | Array<string>>();

    const dataLast = pipe(data, keys());
    expectTypeOf(dataLast).toEqualTypeOf<Array<`${number}`> | Array<string>>();
  });

  it('simple (required) object', () => {
    const result = keys({ a: 'a', b: 1, c: true } as {
      a: string;
      b: number;
      c: boolean;
    });
    expectTypeOf(result).toEqualTypeOf<Array<'a' | 'b' | 'c'>>();
  });

  it('simple partial object', () => {
    const result = keys({ a: 'a', b: 1, c: true } as {
      a?: string;
      b?: number;
      c?: boolean;
    });
    expectTypeOf(result).toEqualTypeOf<Array<'a' | 'b' | 'c'>>();
  });

  it('object with index signature', () => {
    const result = keys({ hello: 'world', a: 'goodbye' } as {
      [keys: string]: string;
      a: string;
    });
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  it('Record with literal union', () => {
    const result = keys({ a: 1, b: 2 } as Record<'a' | 'b', number>);
    expectTypeOf(result).toEqualTypeOf<Array<'a' | 'b'>>();
  });

  it('Record with template string literal', () => {
    const result = keys({ param_123: 'hello', param_456: 'world' } as Record<
      `param_${number}`,
      string
    >);
    expectTypeOf(result).toEqualTypeOf<Array<`param_${number}`>>();
  });

  it('object with just symbol keys', () => {
    const actual = keys({ [Symbol('a')]: 1, [Symbol('b')]: 'world' });
    expectTypeOf(actual).toEqualTypeOf<Array<never>>();
  });

  it('object with number keys', () => {
    const actual = keys({ 123: 'HELLO' });
    expectTypeOf(actual).toEqualTypeOf<Array<'123'>>();
  });

  it('object with combined symbols and keys', () => {
    const actual = keys({ a: 1, [Symbol('b')]: 'world', 123: true });
    expectTypeOf(actual).toEqualTypeOf<Array<'123' | 'a'>>();
  });
});
