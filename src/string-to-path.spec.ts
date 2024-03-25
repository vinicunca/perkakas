import { expect, it } from 'vitest';

import { stringToPath } from './string-to-path';

it('should convert a string to a deeply nested path', () => {
  const res = stringToPath('a.b[0].c');
  expect<['a', 'b', '0', 'c']>(res).toEqual(['a', 'b', '0', 'c']);
});

it('should handle nested dot paths', () => {
  const res = stringToPath('a.b[a.b].c');
  expect<['a', 'b', 'a.b', 'c']>(res).toEqual(['a', 'b', 'a.b', 'c']);
});
