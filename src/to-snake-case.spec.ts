import { describe, expect, it } from 'vitest';
import { pipe } from './pipe';
import { toSnakeCase } from './to-snake-case';

describe('data-first', () => {
  it('on lower case', () => {
    expect(toSnakeCase('hello world')).toBe('hello_world');
  });

  it('on upper case', () => {
    expect(toSnakeCase('HELLO WORLD')).toBe('hello_world');
  });

  it('on mixed case', () => {
    expect(toSnakeCase('HeLlO WoRlD')).toBe('he_ll_o_wo_rl_d');
  });

  it('on snake case', () => {
    expect(toSnakeCase('hello_world')).toBe('hello_world');
  });

  it('on camel case', () => {
    expect(toSnakeCase('helloWorld')).toBe('hello_world');
  });

  it('on kebab case', () => {
    expect(toSnakeCase('hello-world')).toBe('hello_world');
  });

  it('on prefixed string', () => {
    expect(toSnakeCase('__HELLO_WORLD__')).toBe('hello_world');
  });

  it('on string with multiple delimiters', () => {
    expect(toSnakeCase('foo---bar')).toBe('foo_bar');
  });
});

describe('data-last', () => {
  it('on lower case', () => {
    expect(pipe('hello world', toSnakeCase())).toBe('hello_world');
  });

  it('on upper case', () => {
    expect(pipe('HELLO WORLD', toSnakeCase())).toBe('hello_world');
  });

  it('on mixed case', () => {
    expect(pipe('HeLlO WoRlD', toSnakeCase())).toBe('he_ll_o_wo_rl_d');
  });

  it('on snake case', () => {
    expect(pipe('hello_world', toSnakeCase())).toBe('hello_world');
  });

  it('on camel case', () => {
    expect(pipe('helloWorld', toSnakeCase())).toBe('hello_world');
  });

  it('on kebab case', () => {
    expect(pipe('hello-world', toSnakeCase())).toBe('hello_world');
  });
});

describe('type-fest cases', () => {
  it.each(['fooBar', 'foo-bar', 'foo bar', 'foo_bar'])(
    '%s to be foo-bar',
    (str) => {
      expect(toSnakeCase(str)).toBe('foo_bar');
    },
  );

  it('trivial case', () => {
    expect(toSnakeCase('foobar')).toBe('foobar');
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
    expect(toSnakeCase(str)).toBe('foo_bar');
  });

  it('should handle double-converting strings', () => {
    expect(toSnakeCase(toSnakeCase(str))).toBe('foo_bar');
  });
});
