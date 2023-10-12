import { describe, expect, it } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it('removes caps', () => expect(slugify('FooBar')).toBe('foobar'));
  it('removes spaces', () => expect(slugify('this That')).toBe('this-that'));
  it('removes symbols', () => expect(slugify('This!-is*&%#@^up!')).toBe('this-is-up'));
  it('converts non-standard unicode', () => expect(slugify('Woéédan')).toBe('woeedan'));
});
