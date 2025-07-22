import { expect, it } from 'vitest';
import { indexBy } from './index-by';
import { pipe } from './pipe';
import { prop } from './prop';

it('prop', () => {
  const result = pipe({ foo: 'bar' }, prop('foo'));

  expect(result).toBe('bar');
});

it('prop standalone', () => {
  const standAlonePropA = prop('a');

  expect(indexBy([{ a: 1 }, { a: 2 }], standAlonePropA)).toStrictEqual({
    1: { a: 1 },
    2: { a: 2 },
  });
});
