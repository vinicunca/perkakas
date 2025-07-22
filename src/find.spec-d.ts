import { expectTypeOf, it } from 'vitest';
import { find } from './find';
import { isString } from './is-string';

it('can narrow types', () => {
  const result = find([1, 'a'], isString);
  expectTypeOf(result).toEqualTypeOf<string | undefined>();
});
