/**
 * Turn any string into a URL/DOM safe string.
 * @param str the string to slugify
 * @signature
 *  slugify(str)
 * @example
 *  import { slugify } from '@vinicunca/perkakas';
 *
 *  slugify('FooBar'); // => 'foobar'
 *  slugify('This!-is*&%#@^up!'); // => 'this-is-up'
 * @category String
 */
export function slugify(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, '-');
}
