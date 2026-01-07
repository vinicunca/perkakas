import { describe, expect, it } from 'vitest';
import { pipe } from './pipe';
import { toTitleCase } from './to-title-case';

it('empty string', () => {
  expect(toTitleCase('')).toBe('');
});

it('basic words', () => {
  expect(toTitleCase('hello world')).toBe('Hello World');
});

it('camelCase', () => {
  expect(toTitleCase('fooBar')).toBe('Foo Bar');
});

it('pascalCase', () => {
  expect(toTitleCase('FooBar')).toBe('Foo Bar');
});

it('kebab-case', () => {
  expect(toTitleCase('foo-bar')).toBe('Foo Bar');
});

it('snake_case', () => {
  expect(toTitleCase('foo_bar')).toBe('Foo Bar');
});

it('sCREAMING_SNAKE_CASE', () => {
  expect(toTitleCase('FOO_BAR')).toBe('Foo Bar');
});

it('sCREAMING-KEBAB-CASE', () => {
  expect(toTitleCase('FOO-BAR')).toBe('Foo Bar');
});

it('single word lowercase', () => {
  expect(toTitleCase('foo')).toBe('Foo');
});

it('single word uppercase', () => {
  expect(toTitleCase('FOO')).toBe('Foo');
});

it('mixed separators', () => {
  expect(toTitleCase('foo-bar_baz qux')).toBe('Foo Bar Baz Qux');
});

it('data-last', () => {
  expect(pipe('fooBar' as const, toTitleCase())).toBe('Foo Bar');
});

describe('lodash spec', () => {
  // @see https://github.com/lodash/lodash/blob/main/test/test.js#L21226-L21236

  it('lodash example: \'--foo-bar--\'', () => {
    expect(toTitleCase('--foo-bar--')).toBe('Foo Bar');
  });

  it('lodash example: \'fooBar\'', () => {
    expect(toTitleCase('fooBar')).toBe('Foo Bar');
  });

  it('lodash example: \'__FOO_BAR__\'', () => {
    expect(toTitleCase('__FOO_BAR__')).toBe('Foo Bar');
  });
});

describe('edge cases', () => {
  it('repeated separators', () => {
    expect(toTitleCase('foo____bar')).toBe('Foo Bar');
    expect(toTitleCase('foo----bar')).toBe('Foo Bar');
    expect(toTitleCase('foo    bar')).toBe('Foo Bar');
  });

  it('leading and trailing separators', () => {
    expect(toTitleCase('--foo-bar--')).toBe('Foo Bar');
    expect(toTitleCase('__foo_bar__')).toBe('Foo Bar');
    expect(toTitleCase('  foo bar  ')).toBe('Foo Bar');
  });

  it('vendor prefixed css property', () => {
    expect(toTitleCase('-webkit-animation')).toBe('Webkit Animation');
  });

  it('double prefixed', () => {
    expect(toTitleCase('--very-prefixed')).toBe('Very Prefixed');
  });

  it('complex mixed case', () => {
    expect(toTitleCase('foo-bar_abc xyzBarFoo')).toBe(
      'Foo Bar Abc Xyz Bar Foo',
    );
  });

  it('with numbers', () => {
    expect(toTitleCase('foo123bar')).toBe('Foo 123 Bar');
    expect(toTitleCase('foo-bar-123')).toBe('Foo Bar 123');
    expect(toTitleCase('version2Update')).toBe('Version 2 Update');
  });
});

describe('unicode', () => {
  it('maintains diacritics', () => {
    expect(toTitleCase('café naïve')).toBe('Café Naïve');
    expect(toTitleCase('CAFÉ_NAÏVE')).toBe('Café Naïve');
  });

  it('handles non-Latin scripts', () => {
    expect(toTitleCase('москва петербург')).toBe('Москва Петербург');
    expect(toTitleCase('ελλάδα_αθήνα')).toBe('Ελλάδα Αθήνα');
  });
});

describe('preserveConsecutiveUppercase option', () => {
  it('defaults to true', () => {
    expect(toTitleCase('XMLHttpRequest')).toBe('XML Http Request');
    expect(
      toTitleCase('XMLHttpRequest', { preserveConsecutiveUppercase: true }),
    ).toBe('XML Http Request');

    expect(toTitleCase('HTMLParser')).toBe('HTML Parser');
    expect(
      toTitleCase('HTMLParser', { preserveConsecutiveUppercase: true }),
    ).toBe('HTML Parser');

    expect(toTitleCase('getCSSProperty')).toBe('Get CSS Property');
    expect(
      toTitleCase('getCSSProperty', { preserveConsecutiveUppercase: true }),
    ).toBe('Get CSS Property');
  });

  it('false', () => {
    expect(
      toTitleCase('XMLHttpRequest', { preserveConsecutiveUppercase: false }),
    ).toBe('Xml Http Request');
    expect(
      toTitleCase('HTMLParser', { preserveConsecutiveUppercase: false }),
    ).toBe('Html Parser');
    expect(
      toTitleCase('getCSSProperty', { preserveConsecutiveUppercase: false }),
    ).toBe('Get Css Property');
  });

  it('mixed case examples', () => {
    expect(toTitleCase('fooBAR')).toBe('Foo BAR');
    expect(toTitleCase('fooBAR', { preserveConsecutiveUppercase: true })).toBe(
      'Foo BAR',
    );
    expect(toTitleCase('fooBAR', { preserveConsecutiveUppercase: false })).toBe(
      'Foo Bar',
    );
  });

  it('complex examples', () => {
    expect(toTitleCase('foo_BAR-biz_BUZZ')).toBe('Foo BAR Biz BUZZ');
    expect(
      toTitleCase('foo_BAR-biz_BUZZ', { preserveConsecutiveUppercase: true }),
    ).toBe('Foo BAR Biz BUZZ');
    expect(
      toTitleCase('foo_BAR-biz_BUZZ', { preserveConsecutiveUppercase: false }),
    ).toBe('Foo Bar Biz Buzz');
  });

  it('data-last', () => {
    expect(
      pipe('XMLHttpRequest' as const, toTitleCase(/* default options */)),
    ).toBe('XML Http Request');
    expect(
      pipe(
        'XMLHttpRequest' as const,
        toTitleCase({ preserveConsecutiveUppercase: true }),
      ),
    ).toBe('XML Http Request');
    expect(
      pipe(
        'XMLHttpRequest' as const,
        toTitleCase({ preserveConsecutiveUppercase: false }),
      ),
    ).toBe('Xml Http Request');
  });
});
