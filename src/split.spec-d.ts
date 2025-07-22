import { expectTypeOf, it } from 'vitest';
import { split } from './split';

it('non-literals', () => {
  const result = split('' as string, '' as string);

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

it('non-literal data', () => {
  const result = split('' as string, ',');

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

it('non-literal separator', () => {
  const result = split('', ',' as string);

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

it('non-literal limit', () => {
  const result = split('', '', 1 as number);

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

it('literal empty strings', () => {
  const result = split('', '');

  expectTypeOf(result).toEqualTypeOf<[]>();
});

it('trivial literals', () => {
  const result = split('a', ',');

  expectTypeOf(result).toEqualTypeOf<['a']>();
});

it('trivial literals', () => {
  const result = split('a', ',');

  expectTypeOf(result).toEqualTypeOf<['a']>();
});

it('string contains separator', () => {
  const result = split(',', ',');

  expectTypeOf(result).toEqualTypeOf<['', '']>();
});

it('useful split', () => {
  const result = split('a,b,c', ',');

  expectTypeOf(result).toEqualTypeOf<['a', 'b', 'c']>();
});

it('regex split', () => {
  const result = split('a,b,c', /,/u);

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

it('limited split', () => {
  const result = split('a,b,c', ',', 2);

  expectTypeOf(result).toEqualTypeOf<['a', 'b']>();
});

it('limit is higher than splits', () => {
  const result = split('a,b,c', ',', 5);

  expectTypeOf(result).toEqualTypeOf<['a', 'b', 'c']>();
});

it('undefined limit', () => {
  const result = split('a,b,c', ',');

  expectTypeOf(result).toEqualTypeOf<['a', 'b', 'c']>();
});

it('multiple consecutive separators', () => {
  const result = split('a,,b', ',');

  expectTypeOf(result).toEqualTypeOf<['a', '', 'b']>();
});

it('separator at the start and end', () => {
  const result = split(',a,b,', ',');

  expectTypeOf(result).toEqualTypeOf<['', 'a', 'b', '']>();
});

it('empty string separator', () => {
  const result = split('abcdef', '');

  expectTypeOf(result).toEqualTypeOf<['a', 'b', 'c', 'd', 'e', 'f']>();
});

it('empty everything', () => {
  const result = split('', '');

  expectTypeOf(result).toEqualTypeOf<[]>();
});

it('literal string with multiple character separator', () => {
  const result = split('a--b--c', '--');

  expectTypeOf(result).toEqualTypeOf<['a', 'b', 'c']>();
});

it('negative limit', () => {
  const result = split('a,b,c', ',', -1);

  expectTypeOf(result).toEqualTypeOf<['a', 'b', 'c']>();
});

it('fractional limits', () => {
  const result = split('a,b,c', ',', 1.5);

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

it('0 limit', () => {
  const result = split('a,b,c', ',', 0);

  expectTypeOf(result).toEqualTypeOf<[]>();
});
