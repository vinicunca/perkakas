import { constant } from './constant';
import { isDeepEqual } from './is-deep-equal';
import { isNullish } from './is-nullish';
import { isString } from './is-string';
import { omitBy } from './omit-by';
import { pipe } from './pipe';

describe('runtime', () => {
  it('dataFirst', () => {
    expect(
      omitBy({ a: 1, b: 2, A: 3, B: 4 }, (_, key) => key.toUpperCase() === key),
    ).toStrictEqual({ a: 1, b: 2 });
  });

  it('dataLast', () => {
    expect(
      pipe(
        { a: 1, b: 2, A: 3, B: 4 },
        omitBy((_, key) => key.toUpperCase() === key),
      ),
    ).toStrictEqual({ a: 1, b: 2 });
  });

  it('number keys are converted to strings in the mapper', () => {
    omitBy({ 123: 'hello' }, (_, key) => {
      expect(key).toBe('123');
      return true;
    });
  });

  it('symbols are passed through', () => {
    const mySymbol = Symbol('mySymbol');
    expect(omitBy({ [mySymbol]: 1 }, constant(true))).toStrictEqual({
      [mySymbol]: 1,
    });
  });

  it('symbols are not passed to the predicate', () => {
    const mock = vi.fn();
    const data = { [Symbol('mySymbol')]: 1, a: 'hello' };
    omitBy(data, mock);
    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith('hello', 'a', data);
  });
});

describe('typing', () => {
  describe('data first', () => {
    it('it should omit props', () => {
      const result = omitBy(
        { a: 1, b: 2, A: 3, B: 4 } as const,
        constant(true),
      );
      expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; A?: 3; B?: 4 }>();
    });

    it('allow partial type', () => {
      const result = omitBy(
        {} as Partial<{ a: string; b: number }>,
        constant(true),
      );
      expectTypeOf(result).toEqualTypeOf<Partial<{ a: string; b: number }>>();
    });
  });

  describe('data last', () => {
    it('it should omit props', () => {
      const result = pipe(
        { a: 1, b: 2, A: 3, B: 4 } as const,
        omitBy(constant(true)),
      );
      expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; A?: 3; B?: 4 }>();
    });

    it('allow partial type', () => {
      const result = pipe(
        {} as Partial<{ a: string; b: number }>,
        omitBy(constant(true)),
      );
      expectTypeOf(result).toEqualTypeOf<Partial<{ a: string; b: number }>>();
    });
  });

  it('symbols are passed through', () => {
    const requiredSymbol = Symbol('required');
    const optionalSymbol = Symbol('optional');
    const result = omitBy(
      {} as { [requiredSymbol]: number; [optionalSymbol]?: boolean; a: string },
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<{
      [requiredSymbol]: number;
      [optionalSymbol]?: boolean;
      a?: string;
    }>();
  });

  it('symbols are not passed to the predicate', () => {
    omitBy({ [Symbol('mySymbol')]: 1, b: 'hello', c: true }, (value, key) => {
      expectTypeOf(value).toEqualTypeOf<boolean | string>();
      expectTypeOf(key).toEqualTypeOf<'b' | 'c'>();
      return true;
    });
  });

  it('number keys are passed as strings to the predicate', () => {
    omitBy({ 123: 'hello' }, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<'123'>();
      return true;
    });
  });

  it('handles type-predicates', () => {
    const result = omitBy(
      {} as {
        a: string;
        b: number;
        optionalA?: string;
        optionalB?: number;
        union: number | string;
        optionalUnion?: number | string;
      },
      isString,
    );
    expectTypeOf(result).toEqualTypeOf<{
      b: number;
      optionalB?: number;
      union?: number;
      optionalUnion?: number;
    }>();
  });

  it('makes wide types partial', () => {
    const wide = omitBy({ a: 0 } as { a: number }, isDeepEqual(1 as const));
    expectTypeOf(wide).toEqualTypeOf<{ a?: number }>();

    const narrow = omitBy({ a: 1 } as const, (_x): _x is 1 => true);
    // eslint-disable-next-line ts/ban-types -- Expected!
    expectTypeOf(narrow).toEqualTypeOf<{}>();
  });

  it('works well with nullish type-guards', () => {
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

    const resultDefined = omitBy(data, isUndefined);
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

    const resultNonNull = omitBy(data, isNull);
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

    const resultNonNullish = omitBy(data, isNullish);
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

  describe('records with non-narrowing predicates', () => {
    it('string keys', () => {
      const data = {} as Record<string, string>;
      const result = omitBy(data, constant(true));
      expectTypeOf(result).toEqualTypeOf(data);
    });

    it('number keys', () => {
      const data = {} as Record<number, string>;
      const result = omitBy(data, constant(true));
      expectTypeOf(result).toEqualTypeOf<Record<`${number}`, string>>();
    });

    it('combined numbers and strings', () => {
      const data = {} as Record<number | string, string>;
      const result = omitBy(data, constant(true));
      expectTypeOf(result).toEqualTypeOf<Record<string, string>>();
    });

    it('union of records', () => {
      const data = {} as Record<number, string> | Record<string, string>;

      const dataFirst = omitBy(data, constant(true));
      expectTypeOf(dataFirst).toEqualTypeOf<
        Record<`${number}`, string> | Record<string, string>
      >();

      const dataLast = pipe(data, omitBy(constant(true)));
      expectTypeOf(dataLast).toEqualTypeOf<
        Record<`${number}`, string> | Record<string, string>
      >();
    });
  });
});

function isUndefined<T>(value: T | undefined): value is undefined {
  return value === undefined;
}

function isNull<T>(value: T | null): value is null {
  return typeof value === 'object' && value === null;
}
