import { describe, expect, it } from 'vitest';
import { stringToPath } from './string-to-path';

// ! IMPORTANT: The tests in this file need to be synced with the type tests so that we can ensure that the function's runtime implementation returns the same values as the functions type computes. This is critical for this utility because its main purpose is to couple the path string parsing logic with the type so that it could be used in utility functions that take a strictly typed path array as input (e.g. `pathOr`, `setPath`, etc...).

it('empty string', () => {
  expect(stringToPath('')).toStrictEqual([]);
});

it('single property', () => {
  expect(stringToPath('foo')).toStrictEqual(['foo']);
});

it('single array index', () => {
  expect(stringToPath('0')).toStrictEqual([0]);
  expect(stringToPath('123')).toStrictEqual([123]);
});

describe('dot notation', () => {
  it('short chain', () => {
    expect(stringToPath('foo.bar')).toStrictEqual(['foo', 'bar']);
  });

  it('long chain', () => {
    expect(
      stringToPath('a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z'),
    ).toStrictEqual([
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
    ]);
  });

  it('array index before', () => {
    expect(stringToPath('123.foo')).toStrictEqual([123, 'foo']);
  });

  it('array index after', () => {
    expect(stringToPath('foo.123')).toStrictEqual(['foo', 123]);
  });
});

describe('square bracket notation', () => {
  it('array index', () => {
    expect(stringToPath('foo[123]')).toStrictEqual(['foo', 123]);
  });

  it('array index with dot notation after access', () => {
    expect(stringToPath('foo[123].bar')).toStrictEqual(['foo', 123, 'bar']);
  });

  it('array index with dot notation before access', () => {
    expect(stringToPath('foo.bar[123]')).toStrictEqual(['foo', 'bar', 123]);
  });

  it('sequential array index accesses', () => {
    expect(stringToPath('foo[123][456]')).toStrictEqual(['foo', 123, 456]);
  });

  it('complex mix of array index and chained properties', () => {
    expect(stringToPath('foo[123].bar.baz[456][789].qux')).toStrictEqual([
      'foo',
      123,
      'bar',
      'baz',
      456,
      789,
      'qux',
    ]);
  });

  it('unquoted object property access', () => {
    expect(stringToPath('foo[bar]')).toStrictEqual(['foo', 'bar']);
    expect(stringToPath('foo[bar].baz')).toStrictEqual(['foo', 'bar', 'baz']);
  });

  it('single quoted object property access', () => {
    expect(stringToPath('foo[\'bar\']')).toStrictEqual(['foo', 'bar']);
    expect(stringToPath('foo[\'bar\'].baz')).toStrictEqual(['foo', 'bar', 'baz']);
  });

  it('double quoted object property access', () => {
    expect(stringToPath('foo["bar"]')).toStrictEqual(['foo', 'bar']);
    expect(stringToPath('foo["bar"].baz')).toStrictEqual(['foo', 'bar', 'baz']);
  });

  it('recursive chained properties', () => {
    expect(stringToPath('foo[bar.baz]')).toStrictEqual(['foo', 'bar', 'baz']);
  });

  it('2d array access', () => {
    expect(stringToPath('123[456]')).toStrictEqual([123, 456]);
  });

  it('square bracket for a number', () => {
    expect(stringToPath('[123]')).toStrictEqual([123]);
  });

  it('properties with numbers', () => {
    expect(stringToPath('foo[abc123]')).toStrictEqual(['foo', 'abc123']);
    expect(stringToPath('foo[123abc]')).toStrictEqual(['foo', '123abc']);
  });
});

describe('edge-cases', () => {
  it('hyphens', () => {
    expect(stringToPath('foo[\'bar-baz\']')).toStrictEqual(['foo', 'bar-baz']);
  });

  it('underscores', () => {
    expect(stringToPath('foo[\'bar_baz\']')).toStrictEqual(['foo', 'bar_baz']);
  });

  it('spaces', () => {
    expect(stringToPath('foo[\'bar baz\']')).toStrictEqual(['foo', 'bar baz']);
    expect(stringToPath('foo[\' bar\']')).toStrictEqual(['foo', ' bar']);
    expect(stringToPath('foo[\'bar \']')).toStrictEqual(['foo', 'bar ']);
    expect(stringToPath('foo[\' bar \']')).toStrictEqual(['foo', ' bar ']);
  });

  it('dots', () => {
    expect(stringToPath('foo[\'bar.baz\']')).toStrictEqual(['foo', 'bar.baz']);
  });

  it('square brackets', () => {
    expect(stringToPath('foo[\'bar[baz]\']')).toStrictEqual(['foo', 'bar[baz]']);
  });

  it('numbers', () => {
    expect(stringToPath('foo[\'123\']')).toStrictEqual(['foo', '123']);
  });

  it('non-matching quotes', () => {
    expect(stringToPath('foo[\'bar"]')).toStrictEqual(['foo', '\'bar"']);
    expect(stringToPath('foo["bar\']')).toStrictEqual(['foo', '"bar\'']);
  });

  it('missing quote', () => {
    expect(stringToPath('foo[\'bar]')).toStrictEqual(['foo', '\'bar']);
    expect(stringToPath('foo["bar]')).toStrictEqual(['foo', '"bar']);
    expect(stringToPath('foo[bar\']')).toStrictEqual(['foo', 'bar\'']);
    expect(stringToPath('foo[bar"]')).toStrictEqual(['foo', 'bar"']);
  });

  it('empty quoted access', () => {
    expect(stringToPath('foo[\'\'].bar')).toStrictEqual(['foo', '', 'bar']);
  });

  it('array index with leading zeros', () => {
    expect(stringToPath('012')).toStrictEqual(['012']);
  });
});

// We make sure that our limitations from the type system are always reflected
// by the runtime implementation, so that our type reflects the real output of
// our function. Because the type is more complicated than the runtime
// implementation we use the type tests as the specification for the
// runtime implementation.
describe('known type limitations', () => {
  it.todo('nested object access', () => {
    expect(stringToPath('foo[bar[baz]]')).toStrictEqual([
      'foo',
      'bar[baz',
      ']',
    ]);
  });

  it('two sequential dots', () => {
    expect(stringToPath('foo..bar')).toStrictEqual(['foo', 'bar']);
  });

  it('empty unquoted access', () => {
    expect(stringToPath('foo[].bar')).toStrictEqual(['foo', 'bar']);
  });

  it('using backslash to escape a quote', () => {
    expect(stringToPath('a[\'b\\\'c\']')).toStrictEqual(['a', 'b\\\'c']);
  });

  it('using backslash to escape a double-quote', () => {
    expect(stringToPath('a["b\\"c"]')).toStrictEqual(['a', 'b\\"c']);
  });

  it('using a backslash to escape a backslash', () => {
    expect(stringToPath('a[\'b\\\\c\']')).toStrictEqual(['a', 'b\\\\c']);
  });

  describe('whitespace handling', () => {
    it('between the brackets and the quotes', () => {
      expect(stringToPath('foo[ \'bar\']')).toStrictEqual(['foo', ' \'bar\'']);
      expect(stringToPath('foo[\'bar\' ]')).toStrictEqual(['foo', '\'bar\' ']);
      expect(stringToPath('foo[ \'bar\' ]')).toStrictEqual(['foo', ' \'bar\' ']);
    });

    it('between the brackets and the property', () => {
      expect(stringToPath('foo[ bar]')).toStrictEqual(['foo', ' bar']);
      expect(stringToPath('foo[bar ]')).toStrictEqual(['foo', 'bar ']);
      expect(stringToPath('foo[ bar ]')).toStrictEqual(['foo', ' bar ']);
    });

    it('between the brackets and an array index', () => {
      expect(stringToPath('foo[ 123]')).toStrictEqual(['foo', ' 123']);
      expect(stringToPath('foo[123 ]')).toStrictEqual(['foo', '123 ']);
      expect(stringToPath('foo[ 123 ]')).toStrictEqual(['foo', ' 123 ']);
    });

    it('around dots', () => {
      expect(stringToPath('foo .bar')).toStrictEqual(['foo ', 'bar']);
      expect(stringToPath('foo. bar')).toStrictEqual(['foo', ' bar']);
      expect(stringToPath('foo . bar')).toStrictEqual(['foo ', ' bar']);
    });

    it('around prop names', () => {
      expect(stringToPath('foo ')).toStrictEqual(['foo ']);
      expect(stringToPath(' foo')).toStrictEqual([' foo']);
      expect(stringToPath(' foo ')).toStrictEqual([' foo ']);
    });
  });
});

it.each(
  // ¯\_(ツ)_/¯
  ['.', '..', '[', ']', '[[', ']]', '[.', '].', '.[', '.]'],
)('malformed input: %s', (input) => {
  expect(stringToPath(input)).toStrictEqual([]);
});
