import { describe, expectTypeOf, it } from 'vitest';
import { $typed } from '../test/$typed';
import { map } from './map';
import { pipe } from './pipe';
import { prop } from './prop';
import { sortBy } from './sort-by';
import { stringToPath } from './string-to-path';

declare const SYMBOL: unique symbol;
declare const NESTED: { a: { b: Array<{ c: { d: number } }> } };

interface InterfaceWithIndexSignature {
  [key: string]: number;
  a: 1;
}

describe('data-last', () => {
  it('inferred directly', () => {
    expectTypeOf(sortBy([
      { a: 1 },
    ] as const, prop('a'))).toEqualTypeOf<
      [{ readonly a: 1 }]
    >();
  });

  it('inferred indirectly', () => {
    expectTypeOf(pipe([
      { a: 1 },
    ] as const, sortBy(prop('a')))).toEqualTypeOf<
      [{ readonly a: 1 }]
    >();
  });
});

describe('tuples', () => {
  it('fixed tuple', () => {
    expectTypeOf(prop([1, 2, 3] as const, 0)).toEqualTypeOf<1>();
  });

  it('simple array', () => {
    expectTypeOf(prop([] as Array<'cat'>, 3)).toEqualTypeOf<'cat' | undefined>();
  });

  it('prefix array', () => {
    expectTypeOf(prop([1] as [number, ...Array<string>], 10)).toEqualTypeOf<
      string | undefined
    >();
  });
});

describe('unions', () => {
  it('shared prop name', () => {
    expectTypeOf(prop({} as { a: 1 } | { a: 2 }, 'a')).toEqualTypeOf<1 | 2>();
  });

  it('disjoint prop name', () => {
    expectTypeOf(prop({} as { a: 1 } | { b: 2 }, 'a')).toEqualTypeOf<
      1 | undefined
    >();
  });

  it('union of keys', () => {
    expectTypeOf(
      prop({ a: 'hello', b: 'world' } as const, 'a' as 'a' | 'b'),
    ).toEqualTypeOf<'hello' | 'world'>();
  });

  it('union with shared and disjoin keys', () => {
    expectTypeOf(
      prop(
        {} as { a: 'hello'; b: 'world' } | { a: 'hello'; c: 'foo' },
        'a' as 'a' | 'b',
      ),
    ).toEqualTypeOf<'hello' | 'world' | undefined>();
  });

  it('detects typos in union of objects', () => {
    // @ts-expect-error [ts2345] -- 'c' is not a key of the union type
    prop({} as { a: 1 } | { b: 2 }, 'c');
  });

  it('detects typos in unions of keys', () => {
    // @ts-expect-error [ts2345] -- 'c' is not a key of the union type
    prop({ a: 'hello', b: 'world' } as const, 'a' as 'a' | 'c');
  });

  it('union of arrays', () => {
    expectTypeOf(prop([] as Array<string> | Array<number>, 10)).toEqualTypeOf<
      string | number | undefined
    >();
  });

  it('arrays of unions', () => {
    expectTypeOf(prop([] as Array<'cat' | 'dog'>, 100)).toEqualTypeOf<
      'cat' | 'dog' | undefined
    >();
  });

  it('union of tuples', () => {
    expectTypeOf(
      prop([1, 'foo'] as [number, string] | [string, boolean], 1),
    ).toEqualTypeOf<string | boolean>();
  });

  it('union of array and object', () => {
    const data = { a: 1 } as { a: 1 } | ReadonlyArray<'cat'>;

    expectTypeOf(prop(data, 'a')).toEqualTypeOf<1 | undefined>();
    expectTypeOf(prop(data, 100)).toEqualTypeOf<'cat' | undefined>();
    expectTypeOf(prop(data, 'a' as 'a' | number)).toEqualTypeOf<
      1 | 'cat' | undefined
    >();
  });
});

describe('stored partial application', () => {
  it('direct usage', () => {
    const propA = prop('a');

    expectTypeOf(propA({ a: 1 } as const)).toEqualTypeOf<1>();
  });

  it('indirect usage as a callback', () => {
    const propA = prop('a');

    expectTypeOf(map([
      { a: 1 },
      { a: 2 },
    ] as const, propA)).toEqualTypeOf<
      [1 | 2, 1 | 2]
    >();
  });

  it('detects typos', () => {
    const propB = prop('b');

    // @ts-expect-error [ts2353] -- b is not a key of typeof item
    propB({ a: 1 });
  });
});

describe('deep prop', () => {
  const DATA = {} as {
    a: { b: { c: { d: { e: { f: { g: { h: { i: { j: 10 } } } } } } } } };
  };

  it('data-first', () => {
    expectTypeOf(prop(DATA, 'a')).toEqualTypeOf<{
      b: { c: { d: { e: { f: { g: { h: { i: { j: 10 } } } } } } } };
    }>();
    expectTypeOf(prop(DATA, 'a', 'b')).toEqualTypeOf<{
      c: { d: { e: { f: { g: { h: { i: { j: 10 } } } } } } };
    }>();
    expectTypeOf(prop(DATA, 'a', 'b', 'c')).toEqualTypeOf<{
      d: { e: { f: { g: { h: { i: { j: 10 } } } } } };
    }>();
    expectTypeOf(prop(DATA, 'a', 'b', 'c', 'd')).toEqualTypeOf<{
      e: { f: { g: { h: { i: { j: 10 } } } } };
    }>();
    expectTypeOf(prop(DATA, 'a', 'b', 'c', 'd', 'e')).toEqualTypeOf<{
      f: { g: { h: { i: { j: 10 } } } };
    }>();
    expectTypeOf(prop(DATA, 'a', 'b', 'c', 'd', 'e', 'f')).toEqualTypeOf<{
      g: { h: { i: { j: 10 } } };
    }>();
    expectTypeOf(prop(DATA, 'a', 'b', 'c', 'd', 'e', 'f', 'g')).toEqualTypeOf<{
      h: { i: { j: 10 } };
    }>();
    expectTypeOf(
      prop(DATA, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'),
    ).toEqualTypeOf<{
      i: { j: 10 };
    }>();
    expectTypeOf(
      prop(DATA, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'),
    ).toEqualTypeOf<{ j: 10 }>();
    expectTypeOf(
      prop(DATA, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'),
    ).toEqualTypeOf<10>();
  });

  it('data-last', () => {
    expectTypeOf(pipe(DATA, prop('a'))).toEqualTypeOf<{
      b: { c: { d: { e: { f: { g: { h: { i: { j: 10 } } } } } } } };
    }>();
    expectTypeOf(pipe(DATA, prop('a', 'b'))).toEqualTypeOf<{
      c: { d: { e: { f: { g: { h: { i: { j: 10 } } } } } } };
    }>();
    expectTypeOf(pipe(DATA, prop('a', 'b', 'c'))).toEqualTypeOf<{
      d: { e: { f: { g: { h: { i: { j: 10 } } } } } };
    }>();
    expectTypeOf(pipe(DATA, prop('a', 'b', 'c', 'd'))).toEqualTypeOf<{
      e: { f: { g: { h: { i: { j: 10 } } } } };
    }>();
    expectTypeOf(pipe(DATA, prop('a', 'b', 'c', 'd', 'e'))).toEqualTypeOf<{
      f: { g: { h: { i: { j: 10 } } } };
    }>();
    expectTypeOf(pipe(DATA, prop('a', 'b', 'c', 'd', 'e', 'f'))).toEqualTypeOf<{
      g: { h: { i: { j: 10 } } };
    }>();
    expectTypeOf(
      pipe(DATA, prop('a', 'b', 'c', 'd', 'e', 'f', 'g')),
    ).toEqualTypeOf<{
      h: { i: { j: 10 } };
    }>();
    expectTypeOf(
      pipe(DATA, prop('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h')),
    ).toEqualTypeOf<{
      i: { j: 10 };
    }>();
    expectTypeOf(
      pipe(DATA, prop('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i')),
    ).toEqualTypeOf<{ j: 10 }>();
    expectTypeOf(
      pipe(DATA, prop('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j')),
    ).toEqualTypeOf<10>();
  });

  it('detects typos', () => {
    // @ts-expect-error [ts2769] -- "cc" is not a key of DATA.a.b
    prop(DATA, 'a', 'b', 'cc', 'd', 'e');
  });

  it('multi-dimensional arrays', () => {
    const data = [
      [
        [[]],
      ],
    ] as Array<Array<Array<Array<'cat'>>>>;

    expectTypeOf(prop(data, 10)).toExtend<Array<Array<Array<'cat'>>> | undefined>();
    expectTypeOf(prop(data, 10, 20)).toExtend<Array<Array<'cat'>> | undefined>();
    expectTypeOf(prop(data, 10, 20, 30)).toExtend<Array<'cat'> | undefined>();
    expectTypeOf(prop(data, 10, 20, 30, 40)).toExtend<'cat' | undefined>();
  });

  it('element aware deep props', () => {
    const data = [
      { a: 1 },
      { b: 2 },
      { c: 3 },
    ] as const;

    expectTypeOf(prop(data, 0)).toEqualTypeOf<{ readonly a: 1 }>();
    expectTypeOf(prop(data, 1)).toEqualTypeOf<{ readonly b: 2 }>();
    expectTypeOf(prop(data, 2)).toEqualTypeOf<{ readonly c: 3 }>();
    expectTypeOf(prop(data, 0, 'a')).toEqualTypeOf<1>();
    expectTypeOf(prop(data, 1, 'b')).toEqualTypeOf<2>();
    expectTypeOf(prop(data, 2, 'c')).toEqualTypeOf<3>();

    // @ts-expect-error [ts2769] -- "b" is not a key of data[0]
    prop(data, 0, 'b');
    // @ts-expect-error [ts2769] -- "a" is not a key of data[10]
    prop(data, 10, 'a');
  });
});

describe('deeper than 10 levels', () => {
  const data = {} as {
    a: {
      b: {
        c: {
          d: {
            e: {
              f: {
                g: {
                  h: {
                    i: {
                      j: {
                        k: {
                          l: {
                            m: {
                              n: {
                                o: {
                                  p: {
                                    q: {
                                      r: {
                                        s: {
                                          t: {
                                            u: {
                                              v: {
                                                w: {
                                                  x: { y: { z: 'yey!' } };
                                                };
                                              };
                                            };
                                          };
                                        };
                                      };
                                    };
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  it('just before the tip', () => {
    expectTypeOf(
      prop(
        data,
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
      ),
    ).toEqualTypeOf<{ z: 'yey!' }>();
  });

  it('at the tip', () => {
    expectTypeOf(
      prop(
        data,
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
      ),
    ).toEqualTypeOf<'yey!'>();
  });

  it('after the tip', () => {
    expectTypeOf(
      prop(
        data,
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
        // Notice that this also tests that we don't validate that the props are
        // valid after the first 10 levels (otherwise we would need to continue
        // adding more function overloads!) but we still compute the output type
        // correctly.
        'aa',
        'bb',
        'cc',
      ),
    ).toEqualTypeOf<undefined>();
  });
});

describe('optional props', () => {
  it('shallow prop', () => {
    expectTypeOf(prop({} as { a?: 1 }, 'a')).toEqualTypeOf<1 | undefined>();
  });

  it('deep prop', () => {
    expectTypeOf(
      prop({} as { a?: { b?: { c?: 1 } } }, 'a', 'b', 'c'),
    ).toEqualTypeOf<1 | undefined>();
  });

  it('discriminated unions', () => {
    expectTypeOf(
      prop(
        {} as {
          type: 'a';
          b:
            | { type: 'b'; c: { type: 'c'; content: string } | { type: 'c2' } }
            | { type: 'b2' };
        },
        'b',
        'c',
        'content',
      ),
    ).toEqualTypeOf<string | undefined>();
  });
});

// @see https://github.com/remeda/remeda/issues/1274
describe('unbounded records (remeda issue #1274)', () => {
  it('unbounded string record', () => {
    expectTypeOf(prop({} as Record<string, number>, 'x')).toEqualTypeOf<
      number | undefined
    >();
  });

  it('unbounded number record', () => {
    expectTypeOf(prop({} as Record<number, boolean>, 123)).toEqualTypeOf<
      boolean | undefined
    >();
  });

  it('unbounded symbol record', () => {
    const result = prop({} as Record<symbol, Date>, SYMBOL);

    expectTypeOf(result).toEqualTypeOf<Date | undefined>();
  });

  it('template-literal record', () => {
    expectTypeOf(
      prop({} as Record<`data-${string}`, number>, 'data-foo'),
    ).toEqualTypeOf<number | undefined>();
  });

  it('bounded record', () => {
    expectTypeOf(
      prop({} as Record<'a' | 'b', number>, 'a'),
    ).toEqualTypeOf<number>();
  });

  it('partial bounded record', () => {
    expectTypeOf(
      prop({} as Partial<Record<'a' | 'b', number>>, 'a'),
    ).toEqualTypeOf<number | undefined>();
  });

  it('declared props alongside an index signature', () => {
    const data = {} as { [key: string]: number; a: 1 };

    expectTypeOf(prop(data, 'a')).toEqualTypeOf<1>();
    expectTypeOf(prop(data, 'b')).toEqualTypeOf<number | undefined>();
  });

  it('declared props alongside a template-literal index signature', () => {
    const data = {} as { [key: `data-${string}`]: number; a: 1 };

    expectTypeOf(prop(data, 'a')).toEqualTypeOf<1>();
    expectTypeOf(prop(data, 'data-foo')).toEqualTypeOf<number | undefined>();
  });

  it('record intersected with declared props', () => {
    const data = {} as Record<string, number> & { a: boolean };

    expectTypeOf(prop(data, 'a')).toEqualTypeOf<boolean>();
    expectTypeOf(prop(data, 'b')).toEqualTypeOf<number | undefined>();
  });

  it('interface with an index signature', () => {
    const data = {} as InterfaceWithIndexSignature;

    expectTypeOf(prop(data, 'a')).toEqualTypeOf<1>();
    expectTypeOf(prop(data, 'b')).toEqualTypeOf<number | undefined>();
  });

  it('union of records', () => {
    expectTypeOf(
      prop({} as Record<string, number> | Record<string, boolean>, 'x'),
    ).toEqualTypeOf<number | boolean | undefined>();
  });

  it('record in a deep path', () => {
    const data = {} as {
      a: Record<string, { b: { c: 'hello'; d: boolean; e: string } }>;
    };
    const recordEntry = prop(data, 'a', 'x');
    const insideRecordEntry = prop(data, 'a', 'x', 'b');

    expectTypeOf(prop(data, 'a')).toEqualTypeOf<
      Record<string, { b: { c: 'hello'; d: boolean; e: string } }>
    >();
    expectTypeOf(recordEntry).toEqualTypeOf<
      { b: { c: 'hello'; d: boolean; e: string } } | undefined
    >();
    expectTypeOf(insideRecordEntry).toEqualTypeOf<
      { c: 'hello'; d: boolean; e: string } | undefined
    >();
    expectTypeOf(prop(data, 'a', 'x', 'b', 'c')).toEqualTypeOf<
      'hello' | undefined
    >();
    expectTypeOf(prop(data, 'a', 'x', 'b', 'd')).toEqualTypeOf<
      boolean | undefined
    >();
  });

  it('data-last', () => {
    expectTypeOf(pipe({} as Record<string, number>, prop('x'))).toEqualTypeOf<
      number | undefined
    >();
    expectTypeOf(
      pipe({} as { a: Record<string, number> }, prop('a', 'x')),
    ).toEqualTypeOf<number | undefined>();
  });
});

it('wide key without an index signature', () => {
  // @ts-expect-error [ts2769] -- without a spread every key is validated, and `string` isn't a key of the data
  prop({} as { a: number }, $typed<string>());
});

describe('with stringToPath', () => {
  it('with valid paths', () => {
    expectTypeOf(prop(NESTED, ...stringToPath('a'))).toEqualTypeOf<{
      b: Array<{ c: { d: number } }>;
    }>();
    expectTypeOf(prop(NESTED, ...stringToPath('a.b'))).toEqualTypeOf<
      Array<{ c: { d: number } }>
    >();
    expectTypeOf(prop(NESTED, ...stringToPath('a.b[0]'))).toExtend<
      { c: { d: number } } | undefined
    >();
    expectTypeOf(prop(NESTED, ...stringToPath('a.b[0].c'))).toExtend<
      { d: number } | undefined
    >();
    expectTypeOf(prop(NESTED, ...stringToPath('a.b[0].c.d'))).toEqualTypeOf<
      number | undefined
    >();
  });

  it('with invalid paths', () => {
    // @ts-expect-error [ts2769] -- 'x' is not a key of NESTED
    prop(NESTED, ...stringToPath('x.y'));
    // @ts-expect-error [ts2769] -- 'e' is not a key of NESTED.a.b[0].c.d
    prop(NESTED, ...stringToPath('a.b[0].c.d.e'));
    // @ts-expect-error [ts2769] -- 1 is not a key of NESTED.a.b[0].c.d
    prop(NESTED, ...stringToPath('a.b[0].c.d[1]'));
  });
});

describe('path of unknown length', () => {
  it('non-empty array', () => {
    expectTypeOf(
      prop(NESTED, ...$typed<[string, ...Array<string>]>()),
    ).toBeUnknown();
  });

  it('stringToPath on a non-literal string', () => {
    expectTypeOf(prop(NESTED, ...stringToPath($typed<string>()))).toBeUnknown();
  });

  it('generic data', () => {
    // eslint-disable-next-line ts/explicit-function-return-type -- only how `Data` reaches `prop` matters here, not how the wrapper is written.
    const propAt = <Data extends { a: unknown }>(data: Data) =>
      prop(data, ...$typed<Array<string>>());

    expectTypeOf(propAt({ a: 1 })).toBeUnknown();
  });

  describe('keys before the spread', () => {
    it('valid literal keys', () => {
      expectTypeOf(
        prop(NESTED, 'a', 'b', 0, ...$typed<Array<string>>()),
      ).toBeUnknown();
    });

    it('invalid first key', () => {
      prop(
        NESTED,
        // @ts-expect-error [ts2345] -- 'x' is not a key of NESTED
        'x',
        ...$typed<Array<string>>(),
      );
    });

    it('invalid deep key', () => {
      prop(
        NESTED,
        // @ts-expect-error [ts2345] -- 'x' is not a key of NESTED.a.b[0]; TypeScript reports it on the first key of the path
        'a',
        'b',
        0,
        'x',
        ...$typed<Array<string>>(),
      );
    });

    it('invalid key after a wide key', () => {
      prop(
        $typed<Record<string, { a: number }>>(),
        // @ts-expect-error [ts2345] -- 'x' is not a key of the record's values; TypeScript reports it on the first key of the path
        $typed<string>(),
        'x',
        ...$typed<Array<string>>(),
      );
    });

    it('key of one member after a union key', () => {
      expectTypeOf(
        prop(
          $typed<{ a: { b: number }; c: { d: number } }>(),
          $typed<'a' | 'c'>(),
          'b',
          ...$typed<Array<string>>(),
        ),
      ).toBeUnknown();
    });

    it('template-literal key', () => {
      prop(
        $typed<{ a: number }>(),
        // @ts-expect-error [ts2345] -- `a${string}` is checked like a literal key, and it isn't a key of the data
        $typed<`a${string}`>(),
        ...$typed<Array<string>>(),
      );
    });

    it('ten literal keys', () => {
      expectTypeOf(
        prop(
          $typed<{
            a: {
              b: {
                c: { d: { e: { f: { g: { h: { i: { j: { k: 11 } } } } } } } };
              };
            };
          }>(),
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          ...$typed<Array<string>>(),
        ),
      ).toBeUnknown();
    });
  });

  describe('data-last', () => {
    it('possibly empty path', () => {
      pipe(
        NESTED,
        prop(
          // @ts-expect-error [ts2556] -- no data-last overload takes a spread that might be empty
          ...$typed<Array<string>>(),
        ),
      );
    });

    it('non-empty path', () => {
      pipe(
        NESTED,
        prop(
          // @ts-expect-error [ts2345] -- the call resolves against the data-first overload, which reads the first key as the data
          ...$typed<[string, ...Array<string>]>(),
        ),
      );
    });
  });

  it('string data', () => {
    prop(
      // @ts-expect-error [ts2345] -- strings can't be used as data: a string first argument dispatches to data-last at runtime
      'hello',
      ...$typed<Array<string>>(),
    );
  });
});

describe('prevents unsupported data types', () => {
  it('strings', () => {
    // @ts-expect-error [ts2769] -- strings can't be used as data.
    prop('hello', 'length');
  });

  it('number', () => {
    // @ts-expect-error [ts2769] -- numbers can't be used as data.
    prop(123, 'doNumbersHaveProps?');
  });

  it('symbol', () => {
    // @ts-expect-error [ts2769] -- symbols can't be used as data.
    prop(SYMBOL, 'description');
  });
});

describe('known issues!', () => {
  it('data typed `{}`', () => {
    // Data typed `{}` (e.g., `unknown` without `null` and `undefined`) is
    // accepted with a path of unknown length, but when it's a string or a
    // number at runtime the call returns a function instead of the property.
    // Narrowing with `typeof data === 'object'` avoids it.
    expectTypeOf(
      // eslint-disable-next-line ts/no-empty-object-type -- `{}` is what `unknown` narrows to without `null` and `undefined`, the type this pins.
      prop($typed<{}>(), ...$typed<Array<string>>()),
    ).toBeUnknown();
  });

  it('generic data with literal keys before the spread', () => {
    // Inside a generic function, a literal key before a spread is rejected even
    // when the data's constraint has it. Casting the data to its constraint
    // (e.g., `data as { a: unknown }`) works.
    // eslint-disable-next-line ts/explicit-function-return-type -- the issue only shows up inside a generic function wrapper; only how `Data` reaches `prop` matters here, not how the wrapper is written.
    const propA = <Data extends { a: unknown }>(data: Data) =>
      prop(
        data,
        // @ts-expect-error [ts2345] -- every `Data` has `a`, but the key is rejected
        'a',
        ...$typed<Array<string>>(),
      );

    propA({ a: 1 });
  });

  it('union of literal paths', () => {
    // A union of paths is rejected even when each of them is a valid path.
    // Calling `prop` once per path works.
    prop(
      $typed<{ a: { b: number } }>(),
      // @ts-expect-error [ts2345] -- both paths are valid, but the union is rejected
      ...$typed<['a'] | ['a', 'b']>(),
    );
  });

  it('generic path of unknown length', () => {
    // Inside a generic function, a path typed by a type parameter is rejected
    // even when its constraint is a plain array. Casting the path to its
    // constraint (e.g., `path as readonly string[]`) works.
    // eslint-disable-next-line ts/explicit-function-return-type -- the issue only shows up inside a generic function wrapper; only how `Path` reaches `prop` matters here, not how the wrapper is written.
    const propAt = <Path extends ReadonlyArray<string>>(path: Path) =>
      prop(
        { a: 1 },
        // @ts-expect-error [ts2345] -- `prop` accepts `Path`'s constraint, `readonly string[]`, but not `Path` itself
        ...path,
      );

    propAt(['a']);
  });

  it('stringToPath on a generic string', () => {
    // Inside a generic function, `stringToPath` on a string typed by a type
    // parameter is rejected even when its constraint is a plain `string`.
    // Casting the string to its constraint (e.g.,
    // `stringToPath(path as string)`) works.
    // eslint-disable-next-line ts/explicit-function-return-type -- the issue only shows up inside a generic function wrapper; only how `Path` reaches `prop` matters here, not how the wrapper is written.
    const propAt = <Path extends string>(path: Path) =>
      prop(
        { a: 1 },
        // @ts-expect-error [ts2345] -- `prop` accepts `stringToPath` on a plain `string`, but not on `Path`
        ...stringToPath(path),
      );

    propAt('a');
  });
});
