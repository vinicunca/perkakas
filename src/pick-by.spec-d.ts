import { describe, expectTypeOf, it } from 'vitest';
import { constant } from './constant';
import { isDeepEqual } from './is-deep-equal';
import { isDefined } from './is-defined';
import { isNonNull } from './is-non-null';
import { isNonNullish } from './is-non-nullish';
import { isString } from './is-string';
import { pickBy } from './pick-by';
import { pipe } from './pipe';

describe('data first', () => {
  it('it should pick props', () => {
    const data = { a: 1, b: 2, A: 3, B: 4 };
    const result = pickBy(data, constant(true));
    expectTypeOf(result).toEqualTypeOf<Partial<typeof data>>();
  });

  it('allow partial type', () => {
    const result = pickBy({} as { a?: string; b?: number }, constant(true));
    expectTypeOf(result).toEqualTypeOf<Partial<{ a: string; b: number }>>();
  });
});

describe('data last', () => {
  it('it should pick props', () => {
    const data = { a: 1, b: 2, A: 3, B: 4 };
    const result = pipe(data, pickBy(constant(true)));
    expectTypeOf(result).toEqualTypeOf<Partial<typeof data>>();
  });

  it('allow partial type', () => {
    const result = pipe(
      {} as { a?: string; b?: number },
      pickBy(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Partial<{ a: string; b: number }>>();
  });
});

it('symbols are filtered out', () => {
  const mySymbol = Symbol('mySymbol');
  const result = pickBy({ [mySymbol]: 1, a: 123 }, constant(true));
  expectTypeOf(result).toEqualTypeOf<{ a?: number }>();
});

it('symbols are not passed to the predicate', () => {
  pickBy({ [Symbol('mySymbol')]: 1, b: 'hello', c: true }, (value, key) => {
    expectTypeOf(value).toEqualTypeOf<boolean | string>();
    expectTypeOf(key).toEqualTypeOf<'b' | 'c'>();
    return true;
  });
});

it('Makes wide types partial', () => {
  const wide = pickBy({ a: 0 } as { a: number }, isDeepEqual(1 as const));
  expectTypeOf(wide).toEqualTypeOf<{ a?: 1 }>();

  const narrow = pickBy({ a: 1 } as const, (_x): _x is 1 => true);
  expectTypeOf(narrow).toEqualTypeOf<{ a: 1 }>();
});

it('works with type-guards', () => {
  const mySymbol = Symbol('test');
  const result = pickBy(
    {} as {
      a: number;
      b: string;
      [mySymbol]: string;
      literalUnion: 'cat' | 'dog';
      optionalA: number;
      optionalB?: string;
      optionalLiteralUnion?: 'cat' | 'dog';
      partialMatch: 'cat' | 'dog' | 3;
      partialOptionalMatch?: 'cat' | 'dog' | 3;
    },
    isString,
  );
  expectTypeOf(result).toEqualTypeOf<{
    b: string;
    literalUnion: 'cat' | 'dog';
    optionalB?: string;
    optionalLiteralUnion?: 'cat' | 'dog';
    partialMatch?: 'cat' | 'dog';
    partialOptionalMatch?: 'cat' | 'dog';
  }>();
});

it('Works well with nullish type-guards', () => {
  const data = {} as {
    required: string;
    optional?: string;
    undefinable: string | undefined;
    nullable: string | null;
    nullish: string | null | undefined;
    optionalUndefinable?: string | undefined;
    optionalNullable?: string | null;
    optionalNullish?: string | null | undefined;
  };
  const resultDefined = pickBy(data, isDefined);
  expectTypeOf(resultDefined).toEqualTypeOf<{
    required: string;
    optional?: string;
    undefinable?: string;
    nullable: string | null;
    nullish?: string | null;
    optionalUndefinable?: string;
    optionalNullable?: string | null;
    optionalNullish?: string | null;
  }>();

  const resultNonNull = pickBy(data, isNonNull);
  expectTypeOf(resultNonNull).toEqualTypeOf<{
    required: string;
    optional?: string;
    undefinable: string | undefined;
    nullable?: string;
    nullish?: string | undefined;
    optionalUndefinable?: string | undefined;
    optionalNullable?: string;
    optionalNullish?: string | undefined;
  }>();

  const resultNonNullish = pickBy(data, isNonNullish);
  expectTypeOf(resultNonNullish).toEqualTypeOf<{
    required: string;
    optional?: string;
    undefinable?: string;
    nullable?: string;
    nullish?: string;
    optionalUndefinable?: string;
    optionalNullable?: string;
    optionalNullish?: string;
  }>();
});

describe('Records with non-narrowing predicates (Issue #696)', () => {
  it('string keys', () => {
    const data = {} as Record<string, string>;
    const result = pickBy(data, constant(true));
    expectTypeOf(result).toEqualTypeOf(data);
  });

  it('number keys', () => {
    const data = {} as Record<number, string>;
    const result = pickBy(data, constant(true));
    expectTypeOf(result).toEqualTypeOf<Record<`${number}`, string>>();
  });

  it('combined numbers and strings', () => {
    const data = {} as Record<number | string, string>;
    const result = pickBy(data, constant(true));
    expectTypeOf(result).toEqualTypeOf<Record<string, string>>();
  });

  it('union of records', () => {
    const data = {} as Record<number, string> | Record<string, string>;
    const dataFirst = pickBy(data, constant(true));
    expectTypeOf(dataFirst).toEqualTypeOf<
      Record<`${number}`, string> | Record<string, string>
    >();

    const dataLast = pipe(data, pickBy(constant(true)));
    expectTypeOf(dataLast).toEqualTypeOf<
      Record<`${number}`, string> | Record<string, string>
    >();
  });
});
