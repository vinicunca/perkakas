import { stringToPath } from './string-to-path';

it('empty path', () => {
  expect(stringToPath('')).toStrictEqual([]);
});

it('single propName', () => {
  expect(stringToPath('a')).toStrictEqual(['a']);
});

it('single index', () => {
  expect(stringToPath('[0]')).toStrictEqual(['0']);
});

it('should handle short path with only bracket access', () => {
  expect(stringToPath('foo[bar]')).toStrictEqual(['foo', 'bar']);
});

it('should handle bracket access at the end', () => {
  const res = stringToPath('foo.bar[3]');

  expect(res).toStrictEqual(['foo', 'bar', '3']);
});

it('should convert a string to a deeply nested path', () => {
  expect(stringToPath('foo.bar[3].baz')).toStrictEqual([
    'foo',
    'bar',
    '3',
    'baz',
  ]);
});

it('should handle nested dot paths', () => {
  expect(stringToPath('foo[bar.baz].qui.che')).toStrictEqual([
    'foo',
    'bar.baz',
    'qui',
    'che',
  ]);
});

describe('erroneous edge-cases', () => {
  it('index with string value', () => {
    // The function accepts these, is this a valid input?
    expect(stringToPath('[a]')).toStrictEqual(['a']);
  });

  it('prop name with numbers', () => {
    // The function accepts these, is this a valid input?
    expect(stringToPath('1')).toStrictEqual(['1']);
  });

  it.each(
    // ¯\_(ツ)_/¯
    ['.', '..', '[', ']', '[[', ']]', '[.', '].', '.[', '.]'],
  )('malformed input: %s', (input) => {
    expect(stringToPath(input)).toStrictEqual([input]);
  });
});
