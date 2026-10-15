import type { Not } from './not';
import { expectTypeOf, it } from 'vitest';
import { $typed } from '../../../test/$typed';

declare function not<T extends boolean>(data: T): Not<T>;

it('true', () => {
  expectTypeOf(not(true)).toEqualTypeOf<false>();
});

it('false', () => {
  expectTypeOf(not(false)).toEqualTypeOf<true>();
});

it('boolean', () => {
  expectTypeOf(not($typed<boolean>())).toEqualTypeOf<boolean>();
});
