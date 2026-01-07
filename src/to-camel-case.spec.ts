import { describe, expect, it } from 'vitest';
import { pipe } from './pipe';
import { toCamelCase } from './to-camel-case';

describe('data-last', () => {
  it('without options', () => {
    expect(pipe('hello world', toCamelCase())).toBe('helloWorld');
  });

  it('with options (preserveConsecutiveUppercase: true)', () => {
    expect(
      pipe('fooBAR', toCamelCase({ preserveConsecutiveUppercase: true })),
    ).toBe('fooBAR');
  });

  it('with options (preserveConsecutiveUppercase: false)', () => {
    expect(
      pipe('fooBAR', toCamelCase({ preserveConsecutiveUppercase: false })),
    ).toBe('fooBar');
  });
});

describe('tests copied from type-fest\'s tests', () => {
  it('pascal', () => {
    expect(toCamelCase('FooBar')).toBe('fooBar');
  });

  it('kebab', () => {
    expect(toCamelCase('foo-bar')).toBe('fooBar');
  });

  it('complex kebab', () => {
    expect(toCamelCase('foo-bar-abc-123')).toBe('fooBarAbc123');
  });

  it('space', () => {
    expect(toCamelCase('foo bar')).toBe('fooBar');
  });

  it('snake', () => {
    expect(toCamelCase('foo_bar')).toBe('fooBar');
  });

  it('no delimiter from mono', () => {
    expect(toCamelCase('foobar')).toBe('foobar');
  });

  it('mixed', () => {
    expect(toCamelCase('foo-bar_abc xyzBarFoo')).toBe('fooBarAbcXyzBarFoo');
  });

  it('vendor prefixed css property', () => {
    expect(toCamelCase('-webkit-animation')).toBe('webkitAnimation');
  });

  it('double prefixed kebab', () => {
    expect(toCamelCase('--very-prefixed')).toBe('veryPrefixed');
  });

  it('repeated separators', () => {
    expect(toCamelCase('foo____bar')).toBe('fooBar');
  });

  it('uppercase', () => {
    expect(toCamelCase('FOO')).toBe('foo');
  });

  it('lowercase', () => {
    expect(toCamelCase('foo')).toBe('foo');
  });

  it('screaming snake case', () => {
    expect(toCamelCase('FOO_BAR')).toBe('fooBar');
  });

  it('screaming kebab case', () => {
    expect(toCamelCase('FOO-BAR')).toBe('fooBar');
  });

  it.each([
    { input: 'fooBAR', whenTrue: 'fooBAR', whenFalse: 'fooBar' },
    { input: 'fooBARBiz', whenTrue: 'fooBARBiz', whenFalse: 'fooBarBiz' },
    {
      input: 'foo BAR-Biz_BUZZ',
      whenTrue: 'fooBARBizBUZZ',
      whenFalse: 'fooBarBizBuzz',
    },
    {
      input: 'foo\tBAR-Biz_BUZZ',
      whenTrue: 'fooBARBizBUZZ',
      whenFalse: 'fooBarBizBuzz',
    },
  ])(
    'preserveConsecutiveUppercase: $input',
    ({ input, whenTrue, whenFalse }) => {
      expect(toCamelCase(input, { preserveConsecutiveUppercase: true })).toBe(
        whenTrue,
      );
      expect(toCamelCase(input, { preserveConsecutiveUppercase: false })).toBe(
        whenFalse,
      );
    },
  );
});
