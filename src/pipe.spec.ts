import type { LazyCallback } from './internal/types/callback';
import { describe, expect, it, vi } from 'vitest';
import { forceFusion } from '../test/force-fusion';
import { constant } from './constant';
import { filter } from './filter';
import { find } from './find';
import { first } from './first';
import { flat } from './flat';
import { flatMap } from './flat-map';
import { identity } from './identity';
import { SKIP_ITEM } from './internal/lazy-control';
import { lazyDataLastImplementation0 } from './internal/lazy-data-last-implementation';
import { makeReducing } from './internal/make-reducing';
import { join } from './join';
import { map } from './map';
import { multiply } from './multiply';
import { pipe } from './pipe';
import { prop } from './prop';
import { take } from './take';

it('should pass through data with 0 functions', () => {
  const data = { a: 'hello', b: 123 };

  expect(pipe(data)).toBe(data);
});

it('should pipe a single operation', () => {
  expect(pipe(1, multiply(2))).toBe(2);
});

it('should pipe multiple operations', () => {
  expect(pipe(1, multiply(2), (x) => x * 3)).toBe(6);
});

describe('lazy', () => {
  it('lazy map + filter + take', () => {
    const mapper = vi.fn<(x: number) => number>(identity());

    expect(
      pipe(
        [1, 2, 3, 4, 5],
        map(mapper),
        filter((x) => x % 2 === 1),
        take(2),
      ),
    ).toStrictEqual([1, 3]);
    expect(mapper).toHaveBeenCalledTimes(3);
  });

  it('lazy after 1st op', () => {
    const mapper = vi.fn<<T>(x: T) => T>(identity());

    expect(
      pipe({
        inner: [1, 2, 3],
      }, prop('inner'), map(mapper), take(2)),
    ).toStrictEqual([1, 2]);
    expect(mapper).toHaveBeenCalledTimes(2);
  });

  it('multiple lazy', () => {
    const mapper1 = vi.fn<(x: number) => number>(identity());
    const mapper2 = vi.fn<(x: number) => number>(identity());

    expect(
      pipe(
        [1, 2, 3, 4, 5, 6, 7],
        map(mapper1),
        take(4),
        identity(),
        map(mapper2),
        take(2),
      ),
    ).toStrictEqual([1, 2]);
    expect(mapper1).toHaveBeenCalledTimes(4);
    expect(mapper2).toHaveBeenCalledTimes(2);
  });

  describe('a fused sequence ending with a reducing step', () => {
    it('unwraps to the value', () => {
      expect(pipe([1, 2, 3], map(multiply(10)), first())).toBe(10);
    });

    it('unwraps to `undefined` when nothing was emitted', () => {
      expect(
        pipe([1, 2, 3], map(multiply(10)), filter(constant(false)), first()),
      ).toBeUndefined();
    });
  });

  describe('a reducing step followed by a lazy step', () => {
    it('at the start of a sequence', () => {
      const dataLengths: Array<number> = [];

      expect(
        pipe(
          [
            [1, 2],
            [3],
          ],
          // @ts-expect-error [ts2345] -- `find` can return `undefined`, which `map` doesn't accept, but this predicate always finds an item.
          find((value, _index, data) => {
            dataLengths.push(data.length);
            return value.length === 1;
          }),
          map(multiply(10)),
        ),
      ).toStrictEqual([30]);
      // A reducing step ends its sequence, so at the start of one it runs
      // alone, data-first, and its callback sees the whole array.
      expect(dataLengths).toStrictEqual([2, 2]);
    });

    it('at the start of a sequence on another iterable', () => {
      expect(
        pipe(
          [
            [1, 2],
            [3],
          ].values(),
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
          first(),
          map(identity()),
        ),
      ).toStrictEqual([1, 2]);
    });

    it('ending a fused sequence', () => {
      expect(
        pipe(
          [
            [1, 2],
            [3],
          ] as const,
          map(identity()),
          first(),
          map(multiply(10)),
        ),
      ).toStrictEqual([10, 20]);
    });
  });

  describe('a lone lazy function on an array', () => {
    it('a callback that doesn\'t declare `data` gets the array, not the sentinel', () => {
      const data = [1, 2, 3];
      const mapper = vi.fn<
        (value: number, index: number, data: ReadonlyArray<number>) => number
      >((value, index) => value + index);
      pipe(data, map(mapper));

      expect(mapper.mock.calls[0]?.[2]).toBe(data);
    });

    it('reads the input the way its data-first call does', () => {
      const pipeKeys: Array<string | symbol> = [];
      pipe(
        new Proxy([1, 2, 3], {
          get: (target, key, receiver): unknown => {
            pipeKeys.push(key);
            return Reflect.get(target, key, receiver);
          },
        }),
        map(identity()),
      );

      const dataFirstKeys: Array<string | symbol> = [];
      map(
        new Proxy([1, 2, 3], {
          get: (target, key, receiver): unknown => {
            dataFirstKeys.push(key);
            return Reflect.get(target, key, receiver);
          },
        }),
        identity(),
      );

      expect(pipeKeys).toStrictEqual(dataFirstKeys);
    });

    it('a callback gets the whole array a non-lazy function returned', () => {
      expect(
        pipe(
          {
            inner: [1, 2, 3],
          },
          prop('inner'),
          map((_value, _index, data) => data.length),
        ),
      ).toStrictEqual([3, 3, 3]);
    });
  });

  describe('a lone lazy function on another iterable', () => {
    it('skips items', () => {
      expect(
        pipe(
          [0, 1, 2, 3].values(),
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
          filter((x: number) => x % 2 === 0),
        ),
      ).toStrictEqual([0, 2]);
    });

    it('fans out items', () => {
      expect(
        pipe(
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
          [1, 2].values(),
          flatMap((x: number) => [x, x * 10]),
        ),
      ).toStrictEqual([1, 10, 2, 20]);
    });

    it('stops pulling when it stops without a value', () => {
      const input = [1, 2, 3].values();
      pipe(
        input,
        // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
        take(0),
      );

      // `take(0)` can only stop once it gets an item, and an array iterator
      // stays open when the loop reading it exits.
      expect([...input]).toStrictEqual([2, 3]);
    });

    it('symbol items pass through as items, not control signals', () => {
      const item = Symbol('item');

      expect(
        pipe(
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
          [0].values(),
          map(() => item),
        ),
      ).toStrictEqual([item]);
    });

    it('items are never probed', () => {
      // A revoked proxy throws on every trap, so the item survives the pipe only
      // if nothing but its identity was used.
      const { proxy: item, revoke } = Proxy.revocable({}, {});
      revoke();
      const [result] = pipe(
        // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
        [item].values(),
        map(identity()),
      );

      expect(result).toBe(item);
    });

    it('reads the iterable a non-lazy function returned', () => {
      expect(
        pipe(
          {
            inner: [1, 2, 3],
          },
          ({ inner }) => inner.values(),
          // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
          map(multiply(10)),
        ),
      ).toStrictEqual([10, 20, 30]);
    });
  });

  describe('a fused sequence', () => {
    it('iterates an array rather than indexing it', () => {
      const keys: Array<string | symbol> = [];
      pipe(
        new Proxy([1, 2, 3], {
          get: (target, key, receiver): unknown => {
            keys.push(key);
            // The target's own iterator reads the target directly, so only the
            // reads `pipe` makes go through this trap.
            return key === Symbol.iterator
              ? () => target[Symbol.iterator]()
              : Reflect.get(target, key, receiver);
          },
        }),
        forceFusion(),
        map(identity()),
        filter(constant(true)),
      );

      expect(keys).toStrictEqual([Symbol.iterator]);
    });

    it('emits every sub-item when a later step fans out the last value', () => {
      expect(
        pipe(
          [
            [1, 2],
            [3, 4],
            [5, 6],
          ],
          take(1),
          flat(),
        ),
      ).toStrictEqual([1, 2]);
    });

    it('consecutive fan-outs', () => {
      expect(
        pipe(
          [
            [1, 2],
            [3],
          ],
          forceFusion(),
          flat(),
          flatMap((x) => [x, x + 100]),
        ),
      ).toStrictEqual([1, 101, 2, 102, 3, 103]);
    });

    it('symbol items pass through as items, not control signals', () => {
      const item = Symbol('item');

      expect(
        pipe(
          [0],
          map(() => item),
          forceFusion(),
        ),
      ).toStrictEqual([item]);
    });

    it('items are never probed', () => {
      // A revoked proxy throws on every trap, so the item survives the pipe only
      // if nothing but its identity was used.
      const { proxy: item, revoke } = Proxy.revocable({}, {});
      revoke();

      expect(
        pipe([item], forceFusion(), map(identity()), filter(constant(true)))[0],
      ).toBe(item);
    });

    it('pulls from another iterable only until done', () => {
      const input = [1, 2, 3].values();
      pipe(
        input,
        // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
        map(multiply(10)),
        take(1),
      );

      // An array iterator stays open when the loop reading it exits.
      expect([...input]).toStrictEqual([2, 3]);
    });

    it('the function after it still runs', () => {
      expect(pipe([1, 2, 3], map(multiply(10)), take(2), join(','))).toBe(
        '10,20',
      );
    });
  });

  describe('run order', () => {
    it('a sequence on an array that can\'t stop early runs step by step', () => {
      const calls: Array<string> = [];
      pipe(
        [1, 2],
        map((x) => {
          calls.push('map');
          return x;
        }),
        filter(() => {
          calls.push('filter');
          return true;
        }),
      );

      expect(calls).toStrictEqual(['map', 'map', 'filter', 'filter']);
    });

    it('a sequence with a step that can stop early runs item by item', () => {
      const calls: Array<string> = [];
      pipe(
        [1, 2],
        map((x) => {
          calls.push('map');
          return x;
        }),
        filter(() => {
          calls.push('filter');
          return true;
        }),
        take(Infinity),
      );

      expect(calls).toStrictEqual(['map', 'filter', 'map', 'filter']);
    });

    it('a sequence ending with a reducing step that can stop early runs item by item', () => {
      const calls: Array<string> = [];
      pipe(
        [1, 2],
        map((x) => {
          calls.push('map');
          return x;
        }),
        find(() => {
          calls.push('find');
          return false;
        }),
      );

      expect(calls).toStrictEqual(['map', 'find', 'map', 'find']);
    });

    it('a sequence on another iterable runs item by item', () => {
      const calls: Array<string> = [];
      pipe(
        [1, 2].values(),
        // @ts-expect-error [ts2345] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
        map((x: number) => {
          calls.push('map');
          return x;
        }),
        filter(() => {
          calls.push('filter');
          return true;
        }),
      );

      expect(calls).toStrictEqual(['map', 'filter', 'map', 'filter']);
    });
  });

  describe('a sequence on an array that can\'t stop early', () => {
    it('the first step\'s callbacks get the input array', () => {
      const data = [1, 2, 3];
      const mapper = vi.fn<
        (value: number, index: number, data: ReadonlyArray<number>) => number
      >((value, index, items) => value + index + items.length);
      pipe(data, map(mapper), filter(constant(true)));

      expect(mapper.mock.calls[0]?.[2]).toBe(data);
    });

    it('a later step\'s callbacks get the previous step\'s complete output', () => {
      const mapper = vi.fn<LazyCallback<Array<unknown>>>((_value, _index, data) => [
        ...data,
      ]);
      pipe([1, 2, 3], map(multiply(10)), map(mapper));

      expect(mapper).toHaveNthReturnedWith(1, [10, 20, 30]);
      expect(mapper).toHaveNthReturnedWith(2, [10, 20, 30]);
      expect(mapper).toHaveNthReturnedWith(3, [10, 20, 30]);
    });

    it('a callback that doesn\'t declare `data` gets the array, not the sentinel', () => {
      const mapper = vi.fn<
        (value: number, index: number, data: ReadonlyArray<number>) => number
      >((value, index) => value + index);
      pipe([1, 2, 3], map(multiply(10)), map(mapper));

      expect(mapper.mock.calls[0]?.[2]).toStrictEqual([10, 20, 30]);
    });

    it('the input is read the way the first step\'s data-first call reads it', () => {
      const pipeKeys: Array<string | symbol> = [];
      pipe(
        new Proxy([1, 2, 3], {
          get: (target, key, receiver): unknown => {
            pipeKeys.push(key);
            return Reflect.get(target, key, receiver);
          },
        }),
        map(identity()),
        filter(constant(true)),
      );

      const dataFirstKeys: Array<string | symbol> = [];
      map(
        new Proxy([1, 2, 3], {
          get: (target, key, receiver): unknown => {
            dataFirstKeys.push(key);
            return Reflect.get(target, key, receiver);
          },
        }),
        identity(),
      );

      expect(pipeKeys).toStrictEqual(dataFirstKeys);
    });

    it('isn\'t affected by a step past a non-lazy function that can stop early', () => {
      const calls: Array<string> = [];
      pipe(
        [1, 2],
        map((x) => {
          calls.push('map');
          return x;
        }),
        filter(() => {
          calls.push('filter');
          return true;
        }),
        identity(),
        take(1),
      );

      expect(calls).toStrictEqual(['map', 'map', 'filter', 'filter']);
    });

    it('isn\'t affected by a step past a reducing function that can stop early', () => {
      const calls: Array<string> = [];
      pipe(
        [
          [1],
          [2],
        ],
        map((x) => {
          calls.push('map');
          return x;
        }),
        filter(() => {
          calls.push('filter');
          return true;
        }),
        // No utility reduces without being able to stop early, which would
        // fuse the sequence by itself.
        lazyDataLastImplementation0(
          (data: ReadonlyArray<ReadonlyArray<number>>): ReadonlyArray<number> =>
            data[0] ?? [],
          makeReducing(

            () => (value, index) => (index === 0
              ? value
              : SKIP_ITEM),
          ),
        ),
        take(1),
      );

      expect(calls).toStrictEqual(['map', 'map', 'filter', 'filter']);
    });

    it('the function after it still runs', () => {
      expect(
        pipe([1, 2, 3], map(multiply(10)), filter(constant(true)), join(',')),
      ).toBe('10,20,30');
    });

    it('starts on the array a non-lazy function returned', () => {
      const calls: Array<string> = [];
      pipe(
        {
          inner: [1, 2],
        },
        prop('inner'),
        map((x) => {
          calls.push('map');
          return x;
        }),
        filter(() => {
          calls.push('filter');
          return true;
        }),
      );

      expect(calls).toStrictEqual(['map', 'map', 'filter', 'filter']);
    });
  });

  describe.each([
    [
      'an array',
      'the complete array',
      (): ReadonlyArray<number> => [1, 2, 3, 4],
      [
        [
          1,
          0,
          [1, 2, 3, 4],
        ],
        [
          2,
          1,
          [1, 2, 3, 4],
        ],
        [
          3,
          2,
          [1, 2, 3, 4],
        ],
        [
          4,
          3,
          [1, 2, 3, 4],
        ],
      ],
    ],
    [
      'a generator',
      'the items so far',
      // @ts-expect-error [ts2740] -- The utilities only type arrays, but `pipe` iterates any iterable at runtime, which is what this test exercises.
      (): ReadonlyArray<number> => upTo(4),
      [
        [
          1,
          0,
          [1],
        ],
        [
          2,
          1,
          [1, 2],
        ],
        [
          3,
          2,
          [1, 2, 3],
        ],
        [
          4,
          3,
          [1, 2, 3, 4],
        ],
      ],
    ],
  ])(
    'a lone step on %s gets each item\'s index and %s',
    (_name, _data, input, expected) => {
      it('as the only step', () => {
        expect(
          pipe(
            input(),
            map((x, index, data) => [
              x,
              index,
              [...data],
            ]),
          ),
        ).toStrictEqual(expected);
      });

      it('after a non-lazy step', () => {
        expect(
          pipe(
            input(),
            identity(),
            map((x, index, data) => [
              x,
              index,
              [...data],
            ]),
          ),
        ).toStrictEqual(expected);
      });

      it('before a non-lazy step', () => {
        expect(
          pipe(
            input(),
            map((x, index, data) => [
              x,
              index,
              [...data],
            ]),
            identity(),
          ),
        ).toStrictEqual(expected);
      });
    },
  );
});

function* upTo(last: number): Generator<number> {
  for (let value = 1; value <= last; value++) {
    yield value;
  }
}
