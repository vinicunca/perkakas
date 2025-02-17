import type { DisjointUnionFields } from './disjoint-union-fields';

it('should have the complement of SharedUnionFields', () => {
  expectTypeOf<
    DisjointUnionFields<
      | { a: string; b: string; c: string }
      | { a: string; b: string; c: number }
      | { a: string; b: string; d: string }
    >
  >().toEqualTypeOf<{ c: string | number; d: string }>();
});
