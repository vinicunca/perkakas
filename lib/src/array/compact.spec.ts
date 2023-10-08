import { expect, it } from 'vitest';
import { compact } from './compact';

it('filter correctly', () => {
  const items = [false, null, 0, '', undefined, Number.NaN, true, 1, 'a'] as const;
  const results: Array<boolean | number | 'a'> = compact(items);
  expect(results).toEqual([true, 1, 'a']);
});

