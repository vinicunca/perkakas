import { expect, it } from 'vitest';
import { pipe } from './pipe';
import { startsWith } from './starts-with';

it('empty data', () => {
  expect(startsWith('', '')).toBe(true);
  expect(startsWith('' as string, 'hellO')).toBe(false);
});

it('starts with', () => {
  expect(startsWith('hello world', 'hello')).toBe(true);
  expect(startsWith('hello world', 'hello ')).toBe(true);
  expect(startsWith('hello world', 'hello world')).toBe(true);
});

it('doesn\'t start with', () => {
  expect(startsWith('hello world' as string, 'hello world ')).toBe(false);
  expect(startsWith('hello world' as string, 'world')).toBe(false);
  expect(startsWith('hello world' as string, 'world ')).toBe(false);
});

it('matches case', () => {
  expect(startsWith('hello world', 'hello')).toBe(true);
  expect(startsWith('hello world' as string, 'Hello')).toBe(false);
});

it('data-last', () => {
  expect(pipe('hello world', startsWith('hello'))).toBe(true);
});

it('data-last, no match', () => {
  expect(pipe('hello world' as string, startsWith('world'))).toBe(false);
});
