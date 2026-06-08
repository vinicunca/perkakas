import { describe, expectTypeOf, it, test } from 'vitest';
import { $typed } from '../test/$typed';
import { pipe } from './pipe';
import { truncate } from './truncate';

describe('default options', () => {
  it('literals, truncated', () => {
    expectTypeOf(truncate('Hello, world!', 8)).toEqualTypeOf<'Hello...'>();
  });

  it('literals, no truncation', () => {
    expectTypeOf(
      truncate('Hello, world!', 20),
    ).toEqualTypeOf<'Hello, world!'>();
  });

  it('literals, shorter than default omission', () => {
    expectTypeOf(truncate('Hello, world!', 2)).toEqualTypeOf<'..'>();
  });

  it('primitive \'data\'', () => {
    expectTypeOf(
      truncate('Hello, world!' as string, 8),
    ).toEqualTypeOf<string>();
  });

  it('primitive \'n\'', () => {
    expectTypeOf(
      truncate('Hello, world!', 8 as number),
    ).toEqualTypeOf<string>();
  });

  it('both primitive', () => {
    expectTypeOf(
      truncate('Hello, world!' as string, 8 as number),
    ).toEqualTypeOf<string>();
  });
});

describe('custom omission, no separator', () => {
  it('literals, truncated', () => {
    expectTypeOf(
      truncate('Hello, world!', 9, { omission: 'bye' }),
    ).toEqualTypeOf<'Hello,bye'>();
  });

  it('literals, no truncation', () => {
    expectTypeOf(
      truncate('Hello, world!', 20, { omission: 'bye' }),
    ).toEqualTypeOf<'Hello, world!'>();
  });

  it('literals, shorter than default omission', () => {
    expectTypeOf(
      truncate('Hello, world!', 2, { omission: 'bye' }),
    ).toEqualTypeOf<'by'>();
  });

  it('primitive \'data\'', () => {
    expectTypeOf(
      truncate('Hello, world!' as string, 9, { omission: 'bye' }),
    ).toEqualTypeOf<string>();
  });

  it('primitive \'n\'', () => {
    expectTypeOf(
      truncate('Hello, world!', 9 as number, { omission: 'bye' }),
    ).toEqualTypeOf<string>();
  });

  it('primitive \'data\' and \'n\'', () => {
    expectTypeOf(
      truncate('Hello, world!' as string, 9 as number, { omission: 'bye' }),
    ).toEqualTypeOf<string>();
  });

  it('primitive \'omission\'', () => {
    expectTypeOf(
      truncate('Hello, world!', 9, { omission: $typed<string>() }),
    ).toEqualTypeOf<string>();
  });

  it('primitive \'data\' and \'omission\'', () => {
    expectTypeOf(
      truncate('Hello, world!' as string, 9, { omission: $typed<string>() }),
    ).toEqualTypeOf<string>();
  });

  it('primitive \'n\' and \'omission\'', () => {
    expectTypeOf(
      truncate('Hello, world!', 9 as number, { omission: $typed<string>() }),
    ).toEqualTypeOf<string>();
  });

  it('all primitive', () => {
    expectTypeOf(
      truncate('Hello, world!' as string, 9 as number, {
        omission: $typed<string>(),
      }),
    ).toEqualTypeOf<string>();
  });
});

describe('with separator', () => {
  it('literal string separator', () => {
    expectTypeOf(
      truncate('Hello, world!', 8, { separator: ' ' }),
    ).toEqualTypeOf<string>();
  });

  it('primitive separator', () => {
    expectTypeOf(
      truncate('Hello, world!', 8, { separator: ' ' as string }),
    ).toEqualTypeOf<string>();
  });

  it('regex separator', () => {
    expectTypeOf(
      truncate('Hello, world!', 8, { separator: /,/gu }),
    ).toEqualTypeOf<string>();
  });
});

test('n is in range ((data.length - omission.length)..data.length]', () => {
  expectTypeOf(truncate('Hello, world!', 11)).toEqualTypeOf<'Hello, w...'>();
  expectTypeOf(truncate('Hello, world!', 12)).toEqualTypeOf<'Hello, wo...'>();
  expectTypeOf(truncate('Hello, world!', 13)).toEqualTypeOf<'Hello, world!'>();
});

describe('unions', () => {
  describe('union of \'data\'', () => {
    it('both truncated', () => {
      expectTypeOf(truncate('catcat' as 'catcat' | 'dogdog', 4)).toEqualTypeOf<
        'c...' | 'd...'
      >();
    });

    it('both not truncated', () => {
      expectTypeOf(truncate('catcat' as 'catcat' | 'dogdog', 20)).toEqualTypeOf<
        'catcat' | 'dogdog'
      >();
    });

    it('one truncated, one not', () => {
      expectTypeOf(
        truncate('catcat' as 'catcat' | 'dogdogdogdogdogdog', 10),
      ).toEqualTypeOf<'catcat' | 'dogdogd...'>();
    });

    it('\'n\' is shorter than \'omission\'', () => {
      expectTypeOf(
        truncate('catcat' as 'catcat' | 'dogdog', 2),
      ).toEqualTypeOf<'..'>();
    });
  });

  describe('union of \'n\'', () => {
    it('both truncate', () => {
      expectTypeOf(truncate('Hello, world!', 4 as 4 | 5)).toEqualTypeOf<
        'H...' | 'He...'
      >();
    });

    it('both don\'t truncate', () => {
      expectTypeOf(
        truncate('Hello, world!', 20 as 20 | 30),
      ).toEqualTypeOf<'Hello, world!'>();
    });

    it('one truncates, the other doesn\'t', () => {
      expectTypeOf(truncate('Hello, world!', 4 as 4 | 20)).toEqualTypeOf<
        'Hello, world!' | 'H...'
      >();
    });
  });

  describe('union of \'omission\'', () => {
    it('both shorter than \'n\'', () => {
      expectTypeOf(
        truncate('Hello, world!', 4, { omission: '...' as '...' | 'bye' }),
      ).toEqualTypeOf<'Hbye' | 'H...'>();
    });

    it('both longer than \'n\'', () => {
      expectTypeOf(
        truncate('Hello, world!', 3, {
          omission: '...' as 'catcat' | 'dogdog',
        }),
      ).toEqualTypeOf<'cat' | 'dog'>();
    });

    it('one shorter than \'n\', the other longer', () => {
      expectTypeOf(
        truncate('Hello, world!', 4, {
          omission: 'catcat' as '...' | 'catcat',
        }),
      ).toEqualTypeOf<'H...' | 'catc'>();
    });
  });

  it('everything is a union', () => {
    expectTypeOf(
      truncate('catcat' as 'catcat' | 'dogdog', 4 as 4 | 5, {
        omission: '...' as '...' | 'bye',
      }),
    ).toEqualTypeOf<
      'c...' | 'd...' | 'cbye' | 'dbye' | 'cabye' | 'dobye' | 'ca...' | 'do...'
    >();
  });
});

describe('unbounded string literals', () => {
  it('\'n\' is larger than the literal prefix', () => {
    expectTypeOf(
      truncate('Hello, world!' as `H${string}`, 4),
    ).toEqualTypeOf<string>();
  });

  it('\'n\' is smaller than the literal prefix', () => {
    expectTypeOf(
      truncate('Hello, world!' as `Hello, world!${string}`, 4),
    ).toEqualTypeOf<string>();
  });
});

describe('data-last', () => {
  it('with default options', () => {
    expectTypeOf(
      pipe('Hello, world!' as const, truncate(4)),
    ).toEqualTypeOf<'H...'>();
  });

  it('with custom \'omissions\'', () => {
    expectTypeOf(
      pipe('Hello, world!' as const, truncate(4, { omission: 'bye' })),
    ).toEqualTypeOf<'Hbye'>();
  });
});

describe('skips unsupported \'n\' values', () => {
  it('negative numbers', () => {
    expectTypeOf(truncate('Hello, world!', -3)).toEqualTypeOf<string>();
  });

  it('non-integer numbers', () => {
    expectTypeOf(truncate('Hello, world!', 3.5)).toEqualTypeOf<string>();
  });
});

describe('primitive string inputs', () => {
  it('n === 0', () => {
    expectTypeOf(
      truncate('Hello, world!' as string, 0),
    ).toEqualTypeOf<string>();
  });

  it('n < omission.length', () => {
    expectTypeOf(
      truncate('Hello, world!' as string, 2),
    ).toEqualTypeOf<string>();
  });

  it('n === omission.length', () => {
    expectTypeOf(
      truncate('Hello, world!' as string, 3),
    ).toEqualTypeOf<string>();
  });

  it('n is longer than omission', () => {
    expectTypeOf(
      truncate('Hello, world!' as string, 8),
    ).toEqualTypeOf<string>();
  });

  it('n is huge', () => {
    expectTypeOf(
      truncate('Hello, world!' as string, 1_000_000),
    ).toEqualTypeOf<string>();
  });
});
