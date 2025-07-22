import { expectTypeOf, it } from 'vitest';
import { first } from './first';

it('simple empty array', () => {
  const arr: Array<number> = [];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

it('simple array', () => {
  const arr: Array<number> = [1];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

it('simple non-empty array', () => {
  const arr: [number, ...Array<number>] = [1];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number>();
});

it('simple tuple', () => {
  const arr: [number, string] = [1, 'a'];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number>();
});

it('array with more than one item', () => {
  const arr: [number, number, ...Array<number>] = [1, 2];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number>();
});

it('trivial empty array', () => {
  const arr: [] = [];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf(undefined);
});

it('array with last', () => {
  const arr: [...Array<number>, number] = [1];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number>();
});

it('tuple with last', () => {
  const arr: [...Array<string>, number] = ['a', 1];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number | string>();
});

it('simple empty readonly array', () => {
  const arr: ReadonlyArray<number> = [];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

it('simple readonly array', () => {
  const arr: ReadonlyArray<number> = [1];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

it('simple non-empty readonly array', () => {
  const arr: readonly [number, ...Array<number>] = [1];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number>();
});

it('simple readonly tuple', () => {
  const arr: readonly [number, string] = [1, 'a'];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number>();
});

it('readonly array with more than one item', () => {
  const arr: readonly [number, number, ...Array<number>] = [1, 2];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number>();
});

it('readonly trivial empty array', () => {
  const arr: readonly [] = [];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf(undefined);
});

it('readonly array with last', () => {
  const arr: readonly [...Array<number>, number] = [1];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number>();
});

it('readonly tuple with last', () => {
  const arr: readonly [...Array<string>, number] = ['a', 1];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number | string>();
});
