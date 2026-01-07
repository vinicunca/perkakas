import { describe, expect, it } from 'vitest';
import { pipe } from './pipe';
import { toKebabCase } from './to-kebab-case';

describe('data-first', () => {
  it('on lower case', () => {
    expect(toKebabCase('hello world')).toBe('hello-world');
  });

  it('on upper case', () => {
    expect(toKebabCase('HELLO WORLD')).toBe('hello-world');
  });

  it('on mixed case', () => {
    expect(toKebabCase('HeLlO WoRlD')).toBe('he-ll-o-wo-rl-d');
  });

  it('on snake case', () => {
    expect(toKebabCase('hello_world')).toBe('hello-world');
  });

  it('on camel case', () => {
    expect(toKebabCase('helloWorld')).toBe('hello-world');
  });

  it('on kebab case', () => {
    expect(toKebabCase('hello-world')).toBe('hello-world');
  });

  it('on prefixed string', () => {
    expect(toKebabCase('__HELLO_WORLD__')).toBe('hello-world');
  });

  it('on string with multiple delimiters', () => {
    expect(toKebabCase('foo---bar')).toBe('foo-bar');
  });
});

describe('data-last', () => {
  it('on lower case', () => {
    expect(pipe('hello world', toKebabCase())).toBe('hello-world');
  });

  it('on upper case', () => {
    expect(pipe('HELLO WORLD', toKebabCase())).toBe('hello-world');
  });

  it('on mixed case', () => {
    expect(pipe('HeLlO WoRlD', toKebabCase())).toBe('he-ll-o-wo-rl-d');
  });

  it('on snake case', () => {
    expect(pipe('hello_world', toKebabCase())).toBe('hello-world');
  });

  it('on camel case', () => {
    expect(pipe('helloWorld', toKebabCase())).toBe('hello-world');
  });

  it('on kebab case', () => {
    expect(pipe('hello-world', toKebabCase())).toBe('hello-world');
  });
});

describe('type-fest cases', () => {
  it.each(['fooBar', 'foo-bar', 'foo bar', 'foo_bar'])(
    '%s to be foo-bar',
    (str) => {
      expect(toKebabCase(str)).toBe('foo-bar');
    },
  );

  it('trivial case', () => {
    expect(toKebabCase('foobar')).toBe('foobar');
  });
});

describe.each([
  'foo bar',
  'Foo bar',
  'foo Bar',
  'Foo Bar',
  'FOO BAR',
  'fooBar',
  '--foo-bar--',
  '__foo_bar__',
])('lodash case: %s', (str) => {
  it('should convert string to kebab case', () => {
    expect(toKebabCase(str)).toBe('foo-bar');
  });

  it('should handle double-converting strings', () => {
    expect(toKebabCase(toKebabCase(str))).toBe('foo-bar');
  });
});
