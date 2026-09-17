import { expect, it } from 'vitest';
import { endsWith } from './ends-with';
import { pipe } from './pipe';

it('empty data', () => {
  expect(endsWith('', '')).toBe(true);
  expect(endsWith('' as string, 'hellO')).toBe(false);
});

it('ends with', () => {
  expect(endsWith('hello world', 'world')).toBe(true);
  expect(endsWith('hello world', ' world')).toBe(true);
  expect(endsWith('hello world', 'hello world')).toBe(true);
});

it('doesn\'t end with', () => {
  expect(endsWith('hello world' as string, 'hello')).toBe(false);
  expect(endsWith('hello world' as string, 'hello ')).toBe(false);
  expect(endsWith('hello world' as string, 'hello world ')).toBe(false);
});

it('matches case', () => {
  expect(endsWith('hello world', 'world')).toBe(true);
  expect(endsWith('hello world' as string, 'World')).toBe(false);
});

it('data-last', () => {
  expect(pipe('hello world', endsWith('world'))).toBe(true);
});

it('data-last, no match', () => {
  expect(pipe('hello world' as string, endsWith('hello'))).toBe(false);
});
