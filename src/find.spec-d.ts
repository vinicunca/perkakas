import { find } from './find';
import { isString } from './is-string';

test('can narrow types', () => {
  const result = find([1, 'a'], isString);
  expectTypeOf(result).toEqualTypeOf<string | undefined>();
});
