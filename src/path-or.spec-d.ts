import { describe, expectTypeOf, it } from 'vitest';
import { pathOr } from './path-or';
import { stringToPath } from './string-to-path';

describe('examples from lodash migration (issue #779)', () => {
  it('using stringToPath', () => {
    expectTypeOf(
      pathOr({ a: [{ b: 123 }] }, stringToPath('a[0].b'), 456),
    ).toEqualTypeOf<number>();
  });
});
