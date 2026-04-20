import { describe, expect, it } from 'vitest';
import { pipe } from './pipe';
import { truncate } from './truncate';

it('empty string', () => {
  expect(truncate('', 10)).toBe('');
});

it('trivial (0) n', () => {
  expect(truncate('hello, world!', 0)).toBe('');
});

it('trivial case', () => {
  expect(truncate('hello, world!', 8)).toBe('hello...');
});

it('empty omission', () => {
  expect(truncate('hello, world!', 5, { omission: '' })).toBe('hello');
});

it('empty separator', () => {
  expect(truncate('hello, world!', 8, { separator: '' })).toBe('hello...');
});

it('trivial regex separator', () => {
  expect(truncate('hello, world!', 8, { separator: /./u })).toBe('hello...');
});

it('trivial global regex separator', () => {
  expect(truncate('hello, world!', 8, { separator: /./gu })).toBe('hello...');
});

it('multiple string separators within maxLength', () => {
  expect(truncate('cat, dog, mouse, elephant', 20, { separator: ',' })).toBe(
    'cat, dog, mouse...',
  );
});

it('multiple regex separators within maxLength', () => {
  expect(
    // eslint-disable-next-line sonar/single-character-alternation
    truncate('cat. dog, mouse. elephant', 20, { separator: /,|\./gu }),
  ).toBe('cat. dog, mouse...');
});

it('string separator matches after maxLength', () => {
  expect(
    truncate('A long sentence followed by a period. Another sentence', 20, {
      separator: '.',
    }),
  ).toBe('A long sentence f...');
});

it('string separator never matches', () => {
  expect(
    truncate('A long sentence without the chosen separator', 20, {
      separator: '|',
    }),
  ).toBe('A long sentence w...');
});

it('regex separator matches after maxLength', () => {
  expect(
    truncate('A long sentence followed by a period. Another sentence', 20, {
      separator: /\./u,
    }),
  ).toBe('A long sentence f...');
});

it('regex separator never matches', () => {
  expect(
    truncate('A long sentence without the chosen separator', 20, {
      // eslint-disable-next-line regexp/no-dupe-disjunctions, regexp/no-empty-alternative, sonar/no-empty-alternatives
      separator: /|/u,
    }),
  ).toBe('A long sentence w...');
});

it('omission is longer than maxLength', () => {
  expect(truncate('Hello, world!', 5, { omission: '123456789' })).toBe('12345');
});

it('n is in range ((data.length - omission.length)..data.length]', () => {
  expect(truncate('Hello, world!', 11)).toBe('Hello, w...');
  expect(truncate('Hello, world!', 12)).toBe('Hello, wo...');
  expect(truncate('Hello, world!', 13)).toBe('Hello, world!');
});

describe('data-last', () => {
  it('has an implicit default options object', () => {
    expect(pipe('Hello, world!', truncate(8))).toBe('Hello...');
  });

  it('accepts an options object', () => {
    expect(
      pipe('Hello, world!', truncate(10, { omission: 'Bye!', separator: ',' })),
    ).toBe('HelloBye!');
  });
});

// Based on the tests in: https://github.com/lodash/lodash/blob/4.17.15/test/test.js#L22614-L22701 without tests that don't make sense in a TypeScript
// environment (like tests that check implicit type coercion).
describe('lodash spec', () => {
  it('should not truncate if `string` is <= `length`', () => {
    expect(truncate('hi-diddly-ho there, neighborino', 31)).toBe(
      'hi-diddly-ho there, neighborino',
    );
    expect(truncate('hi-diddly-ho there, neighborino', 33)).toBe(
      'hi-diddly-ho there, neighborino',
    );
  });

  it('should truncate string the given length', () => {
    expect(truncate('hi-diddly-ho there, neighborino', 24)).toBe(
      'hi-diddly-ho there, n...',
    );
  });

  it('should support a `omission` option', () => {
    expect(
      truncate('hi-diddly-ho there, neighborino', 30, { omission: ' [...]' }),
    ).toBe('hi-diddly-ho there, neig [...]');
  });

  it('should support a `maxLength` option', () => {
    expect(truncate('hi-diddly-ho there, neighborino', 4)).toBe('h...');
  });

  it('should support a `separator` option', () => {
    expect(
      truncate('hi-diddly-ho there, neighborino', 24, { separator: ' ' }),
    ).toBe('hi-diddly-ho there,...');
    expect(
      truncate('hi-diddly-ho there, neighborino', 24, { separator: /,? +/u }),
    ).toBe('hi-diddly-ho there...');
    expect(
      truncate('hi-diddly-ho there, neighborino', 24, { separator: /,? +/gu }),
    ).toBe('hi-diddly-ho there...');
  });

  it('should treat negative `length` as `0`', () => {
    // Lodash returns the omission, but that would cause the string to overflow
    // its defined max length which seems odd...
    expect(truncate('hi-diddly-ho there, neighborino', -2)).toBe('');
  });

  it('should coerce `length` to an integer', () => {
    expect(truncate('hi-diddly-ho there, neighborino', 4.6)).toBe('h...');
    expect(truncate('hi-diddly-ho there, neighborino', Number.NaN)).toBe('...');
  });
});
