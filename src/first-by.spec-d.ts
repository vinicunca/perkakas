import type { NonEmptyArray } from "./internal/types/non-empty-array";

import { firstBy } from './first-by';
import { identity } from './identity';

it('can return undefined on arrays', () => {
  const data: ReadonlyArray<number> = [1, 2, 3];
  const result = firstBy(data, identity());
  expectTypeOf(result).toBeNullable();
});

it('can\'t return undefined on non-empty array', () => {
  const data: NonEmptyArray<number> = [1, 2, 3];
  const result = firstBy(data, identity());
  expectTypeOf(result).not.toBeNullable();
});

it('only returns null on the empty array', () => {
  const data = [] as const;
  const result = firstBy(data, identity());
  expectTypeOf(result).toBeUndefined();
});
