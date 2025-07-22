import { expectTypeOf, it } from 'vitest';
import { constant } from './constant';
import { identity } from './identity';
import { pipe } from './pipe';
import { pullObject } from './pull-object';

it('string keys', () => {
  const data = ['a', 'b'];

  const dataFirst = pullObject(data, identity(), constant('value'));
  expectTypeOf(dataFirst).toEqualTypeOf<Record<string, string>>();

  const dataLast = pipe(data, pullObject(identity(), constant('value')));
  expectTypeOf(dataLast).toEqualTypeOf<Record<string, string>>();
});

it('number keys', () => {
  const data = [1, 2];

  const dataFirst = pullObject(data, identity(), constant(3));
  expectTypeOf(dataFirst).toEqualTypeOf<Record<number, number>>();

  const dataLast = pipe(data, pullObject(identity(), constant(3)));
  expectTypeOf(dataLast).toEqualTypeOf<Record<number, number>>();
});

it('symbol keys', () => {
  const data = [Symbol('a'), Symbol('b')];

  const dataFirst = pullObject(data, identity(), constant(Symbol('c')));
  expectTypeOf(dataFirst).toEqualTypeOf<Record<symbol, symbol>>();

  const dataLast = pipe(data, pullObject(identity(), constant(Symbol('c'))));
  expectTypeOf(dataLast).toEqualTypeOf<Record<symbol, symbol>>();
});

it('number constants', () => {
  const data = [1, 2] as const;

  const dataFirst = pullObject(data, identity(), constant(3 as const));
  expectTypeOf(dataFirst).toEqualTypeOf<Partial<Record<1 | 2, 3>>>();

  const dataLast = pipe(data, pullObject(identity(), constant(3 as const)));
  expectTypeOf(dataLast).toEqualTypeOf<Partial<Record<1 | 2, 3>>>();
});

it('string constants', () => {
  const data = ['a', 'b'] as const;

  const dataFirst = pullObject(data, identity(), constant('c' as const));
  expectTypeOf(dataFirst).toEqualTypeOf<Partial<Record<'a' | 'b', 'c'>>>();

  const dataLast = pipe(data, pullObject(identity(), constant('c' as const)));
  expectTypeOf(dataLast).toEqualTypeOf<Partial<Record<'a' | 'b', 'c'>>>();
});

it('literal unions keys', () => {
  const data = [1, 2];

  const dataFirst = pullObject(
    data,
    (item) => (item % 2 === 0 ? 'odd' : 'even'),
    constant('c'),
  );
  expectTypeOf(dataFirst).toEqualTypeOf<
    Partial<Record<'even' | 'odd', string>>
  >();

  const dataLast = pipe(
    data,
    pullObject((item) => (item % 2 === 0 ? 'odd' : 'even'), constant('c')),
  );
  expectTypeOf(dataLast).toEqualTypeOf<
    Partial<Record<'even' | 'odd', string>>
  >();
});

it('template string keys', () => {
  const data = [1, 2];

  const dataFirst = pullObject(
    data,
    (item) => `prefix_${item}`,
    constant('value'),
  );
  expectTypeOf(dataFirst).toEqualTypeOf<Record<`prefix_${number}`, string>>();

  const dataLast = pipe(
    data,
    pullObject((item) => `prefix_${item}`, constant('value')),
  );
  expectTypeOf(dataLast).toEqualTypeOf<Record<`prefix_${number}`, string>>();
});
