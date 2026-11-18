/* eslint-disable unicorn/consistent-function-scoping --
 * Evaluators capture nothing, and lazy implementations nest them in a factory;
 * each one stays inline to read next to its assertion.
 */

import { describe, expect, it, vi } from 'vitest';
import { identity } from '../identity';
import {
  buildFusedSequence,
  runFusedSequence,
  type LazyStep,
} from './fused-sequence';
import { manyLazyValues, SKIP_ITEM } from './lazy-control';
import {
  lazyDataLastImplementation,
  type LazyEvaluatorFactory,
  type LazyUnaryFunction,
} from './lazy-data-last-implementation';
import { makeReducing } from './make-reducing';
import {
  lastLazyValue,
  STOP,
  type StoppableLazyEvaluator,
} from './make-stoppable';
import { requireData } from './require-data';
import type { LazyEvaluator } from './types/lazy-evaluator';
import { UNEXPECTED_ACCESS_SENTINEL } from './unexpected-access-sentinel';

describe(buildFusedSequence, () => {
  it('takes consecutive lazy functions', () => {
    expect(buildFusedSequence([lazy(), lazy()], 0)).toHaveLength(2);
  });

  it('starts at `startIndex`', () => {
    const skipped = vi.fn<() => LazyEvaluator>(() => (value) => value);
    buildFusedSequence([lazyFunction(skipped), lazy()], 1);

    expect(skipped).not.toHaveBeenCalled();
  });

  it('ends before a non-lazy function', () => {
    expect(buildFusedSequence([lazy(), identity(), lazy()], 0)).toHaveLength(1);
  });

  it('ends after a reducing function', () => {
    expect(
      buildFusedSequence(
        [lazy(), lazyFunction(makeReducing(() => (value) => value)), lazy()],
        0,
      ),
    ).toHaveLength(2);
  });

  it('builds evaluators with their lazy arguments', () => {
    const lazyImplementation = vi.fn<
      (first: number, second: string) => LazyEvaluator
    >(() => (value) => value);
    buildFusedSequence(
      [
        // @ts-expect-error [ts2322] -- The `never` arguments of the default `LazyUnaryFunction` are what let it hold any lazy function, and the helper only spreads `lazyArgs` into the `lazy` they were built with.
        lazyDataLastImplementation(
          (
            _data: ReadonlyArray<unknown>,
            ..._args: Readonly<Parameters<typeof lazyImplementation>>
          ) => {
            throw new Error(
              'Intentional! a fused sequence doesn\'t call the data-first',
            );
          },
          [1, 'a'],
          lazyImplementation,
        ),
      ],
      0,
    );

    expect(lazyImplementation).toHaveBeenCalledExactlyOnceWith(1, 'a');
  });

  it('builds evaluators anew each time, as they can hold state', () => {
    const lazyImplementation = vi.fn<() => LazyEvaluator>(
      () => (value) => value,
    );
    const lazyFunctions = [lazyFunction(lazyImplementation)];
    buildFusedSequence(lazyFunctions, 0);
    buildFusedSequence(lazyFunctions, 0);

    expect(lazyImplementation).toHaveBeenCalledTimes(2);
  });

  describe('data', () => {
    it('an empty buffer when data is required', () => {
      expect(
        buildFusedSequence(
          [lazyFunction((): LazyEvaluator => requireData((value) => value))],
          0,
        )[0]?.data,
      ).toStrictEqual([]);
    });

    it('the sentinel when data isn\'t required', () => {
      const data = buildFusedSequence([lazy()], 0)[0]?.data;

      // Asserting identity with `toBe` would make the matcher format the
      // sentinel on failure, which throws and hides the real mismatch.
      expect(() => data?.at(0)).toThrow(/^Remeda: /u);
    });
  });
});

describe(runFusedSequence, () => {
  it('doesn\'t bind evaluators to their step', () => {
    const evaluator = vi.fn<LazyEvaluator>((value) => value);
    runFusedSequence([1], [step(evaluator)]);

    expect(evaluator.mock.contexts[0]).toBeUndefined();
  });

  describe('input', () => {
    it('empty', () => {
      expect(runFusedSequence([], [step()])).toStrictEqual([]);
    });

    it('an array is iterated, not indexed', () => {
      // A reactive array that instruments iteration tracks one dependency this
      // way, instead of one per index.
      const keys: Array<string | symbol> = [];
      runFusedSequence(
        new Proxy([1, 2, 3], {
          get: (target, key, receiver): unknown => {
            keys.push(key);
            // The target's own iterator reads the target directly, so only the
            // reads the loop makes go through this trap.
            return key === Symbol.iterator
              ? () => target[Symbol.iterator]()
              : Reflect.get(target, key, receiver);
          },
        }),
        [step()],
      );

      expect(keys).toStrictEqual([Symbol.iterator]);
    });

    it('a string is iterated by character', () => {
      expect(runFusedSequence('abc', [step()])).toStrictEqual(['a', 'b', 'c']);
    });

    it('a generator is pulled only until done', () => {
      expect(
        runFusedSequence(naturals(), [
          step((value, index, _data, slot) =>
            index === 2 ? lastLazyValue(value, slot) : value,
          ),
        ]),
      ).toStrictEqual([0, 1, 2]);
    });

    it('a generator is closed when done', () => {
      const onClose = vi.fn<() => void>();
      runFusedSequence(closesWith(onClose), [step(() => STOP)]);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('items', () => {
    it.each([null, undefined, 0, '', false])('%s is emitted', (item) => {
      expect(runFusedSequence([item], [step()])).toStrictEqual([item]);
    });

    it('a symbol is emitted', () => {
      const mySymbol = Symbol('item');

      expect(runFusedSequence([0], [step(() => mySymbol)])).toStrictEqual([
        mySymbol,
      ]);
    });

    it('are never probed', () => {
      // A revoked proxy throws on every trap, so the item survives only if
      // nothing but its identity was used.
      const { proxy: item, revoke } = Proxy.revocable({}, {});
      revoke();

      expect(runFusedSequence([item], [step(), step()])[0]).toBe(item);
    });
  });

  describe('index', () => {
    it('counts the items the step consumed, not input positions', () => {
      expect(
        runFusedSequence(
          [1, 2, 3, 4],
          [
            step((value) => (value === 2 || value === 4 ? value : SKIP_ITEM)),
            step((_value, index) => index),
          ],
        ),
      ).toStrictEqual([0, 1]);
    });

    it('advances once per fan-out for the step that fans out', () => {
      expect(
        runFusedSequence(
          ['a', 'b'],
          [
            step((value, index, _data, slot) =>
              manyLazyValues([value, index], slot),
            ),
          ],
        ),
      ).toStrictEqual(['a', 0, 'b', 1]);
    });

    it('advances once per sub-item for the steps after a fan-out', () => {
      expect(
        runFusedSequence(
          ['a', 'b'],
          [
            step((_value, _index, _data, slot) => manyLazyValues([1, 2], slot)),
            step((_value, index) => index),
          ],
        ),
      ).toStrictEqual([0, 1, 2, 3]);
    });

    it('advances across consecutive fan-outs', () => {
      expect(
        runFusedSequence(
          ['a', 'b'],
          [
            step((_value, _index, _data, slot) => manyLazyValues([1, 2], slot)),
            step((value, _index, _data, slot) =>
              manyLazyValues([value, value], slot),
            ),
            step((_value, index) => index),
          ],
        ),
      ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe('data', () => {
    it('the items so far when required', () => {
      expect(
        runFusedSequence(
          [1, 2, 3],
          [stepWithData((_value, _index, data) => [...data])],
        ),
      ).toStrictEqual([[1], [1, 2], [1, 2, 3]]);
    });

    it('includes the items the step skipped', () => {
      expect(
        runFusedSequence(
          [1, 2, 3],
          [
            stepWithData((value, _index, data) =>
              value === 3 ? [...data] : SKIP_ITEM,
            ),
          ],
        ),
      ).toStrictEqual([[1, 2, 3]]);
    });

    it('holds what reached the step, not the input', () => {
      expect(
        runFusedSequence(
          [1, 2, 3],
          [
            step((value) => (value === 2 ? SKIP_ITEM : value)),
            stepWithData((_value, _index, data) => [...data]),
          ],
        ),
      ).toStrictEqual([[1], [1, 3]]);
    });

    it('includes the items a fan-out emitted', () => {
      expect(
        runFusedSequence(
          [1],
          [
            step((_value, _index, _data, slot) =>
              manyLazyValues([1, 2, 3], slot),
            ),
            stepWithData((_value, _index, data) => [...data]),
          ],
        ),
      ).toStrictEqual([[1], [1, 2], [1, 2, 3]]);
    });
  });

  describe('skipping an item', () => {
    it('drops it', () => {
      expect(
        runFusedSequence(
          [1, 2, 3],
          [step((value) => (value === 2 ? SKIP_ITEM : value))],
        ),
      ).toStrictEqual([1, 3]);
    });

    it('hides it from later steps', () => {
      const later = vi.fn<LazyEvaluator>((value) => value);
      runFusedSequence([1, 2, 3], [step(() => SKIP_ITEM), step(later)]);

      expect(later).not.toHaveBeenCalled();
    });
  });

  describe('fanning out an item', () => {
    it('feeds every sub-item through the later steps', () => {
      expect(
        runFusedSequence(
          [1, 2],
          [
            step((value, _index, _data, slot) =>
              manyLazyValues([value, 'sub-item'], slot),
            ),
            step((value) => [value]),
          ],
        ),
      ).toStrictEqual([[1], ['sub-item'], [2], ['sub-item']]);
    });

    it('to nothing drops it', () => {
      expect(
        runFusedSequence(
          [1, 2, 3],
          [
            step((value, _index, _data, slot) =>
              manyLazyValues(value === 2 ? [] : [value], slot),
            ),
          ],
        ),
      ).toStrictEqual([1, 3]);
    });

    it('to more sub-items than a call can take arguments emits them all', () => {
      const subItems = Array.from({ length: 500_000 }, (_item, index) => index);

      expect(
        runFusedSequence(
          [0],
          [
            step((_value, _index, _data, slot) =>
              manyLazyValues(subItems, slot),
            ),
          ],
        ),
      ).toHaveLength(500_000);
    });

    it('survives a later fan-out overwriting the slot', () => {
      expect(
        runFusedSequence(
          [0],
          [
            step((_value, _index, _data, slot) => manyLazyValues([1, 2], slot)),
            step((value, _index, _data, slot) =>
              manyLazyValues([value, 'sub-item'], slot),
            ),
          ],
        ),
      ).toStrictEqual([1, 'sub-item', 2, 'sub-item']);
    });

    describe('when a later step stops on a sub-item', () => {
      it('ends the sub-items', () => {
        expect(
          runFusedSequence(
            [0],
            [
              step((_value, _index, _data, slot) =>
                manyLazyValues([1, 2, 3], slot),
              ),
              step((value) => (value === 2 ? STOP : value)),
            ],
          ),
        ).toStrictEqual([1]);
      });

      it('ends the iteration', () => {
        const evaluator = vi.fn<LazyEvaluator>((_value, _index, _data, slot) =>
          manyLazyValues([1, 2], slot),
        );
        runFusedSequence([1, 2, 3], [step(evaluator), step(() => STOP)]);

        expect(evaluator).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('stopping', () => {
    it('emits nothing for the item', () => {
      expect(
        runFusedSequence(
          [1, 2, 3],
          [step((value) => (value === 2 ? STOP : value))],
        ),
      ).toStrictEqual([1]);
    });

    it('ends the iteration', () => {
      const evaluator = vi.fn<LazyEvaluator>((value) => value);
      runFusedSequence([1, 2, 3], [step(evaluator), step(() => STOP)]);

      expect(evaluator).toHaveBeenCalledTimes(1);
    });

    it('hides the item from later steps', () => {
      const later = vi.fn<LazyEvaluator>((value) => value);
      runFusedSequence([1, 2, 3], [step(() => STOP), step(later)]);

      expect(later).not.toHaveBeenCalled();
    });
  });

  describe('stopping with a last value', () => {
    it('feeds it through the later steps', () => {
      expect(
        runFusedSequence(
          [1, 2, 3],
          [
            step((_value, _index, _data, slot) => lastLazyValue('last', slot)),
            step((value) => [value]),
          ],
        ),
      ).toStrictEqual([['last']]);
    });

    it('ends the iteration', () => {
      const evaluator = vi.fn<StoppableLazyEvaluator>(
        (value, _index, _data, slot) => lastLazyValue(value, slot),
      );
      runFusedSequence([1, 2, 3], [step(evaluator)]);

      expect(evaluator).toHaveBeenCalledTimes(1);
    });

    it('ends the iteration when a later step skips it', () => {
      const evaluator = vi.fn<StoppableLazyEvaluator>(
        (value, _index, _data, slot) => lastLazyValue(value, slot),
      );
      runFusedSequence([1, 2, 3], [step(evaluator), step(() => SKIP_ITEM)]);

      expect(evaluator).toHaveBeenCalledTimes(1);
    });

    it('emits every sub-item when a later step fans it out', () => {
      expect(
        runFusedSequence(
          [1, 2, 3],
          [
            step((value, _index, _data, slot) => lastLazyValue(value, slot)),
            step((value, _index, _data, slot) =>
              manyLazyValues([value, 'sub-item'], slot),
            ),
          ],
        ),
      ).toStrictEqual([1, 'sub-item']);
    });

    it('ends the iteration when a later step fans it out', () => {
      const evaluator = vi.fn<StoppableLazyEvaluator>(
        (value, _index, _data, slot) => lastLazyValue(value, slot),
      );
      runFusedSequence(
        [1, 2, 3],
        [
          step(evaluator),
          step((value, _index, _data, slot) => manyLazyValues([value], slot)),
        ],
      );

      expect(evaluator).toHaveBeenCalledTimes(1);
    });
  });

  describe('controls from another copy of the library are recognized', () => {
    // Re-evaluating the modules that define the controls gives each test its
    // own copy of them, the way a second installed version, or the CJS build
    // next to the ESM one, would. The payloads of the controls land in the slot
    // of the sequence that receives them.

    it('a skip', async () => {
      vi.resetModules();
      const { SKIP_ITEM: otherSkipItem } = await import('./lazy-control');

      expect(
        runFusedSequence(
          [1, 2, 3],
          [step((value) => (value === 2 ? otherSkipItem : value))],
        ),
      ).toStrictEqual([1, 3]);
    });

    it('a fan-out feeding a last value', async () => {
      vi.resetModules();
      const { manyLazyValues: otherManyLazyValues } =
        await import('./lazy-control');
      const { lastLazyValue: otherLastLazyValue } =
        await import('./make-stoppable');

      expect(
        runFusedSequence(
          [0],
          [
            step((_value, _index, _data, slot) =>
              otherManyLazyValues([1, 2, 3], slot),
            ),
            step((value, _index, _data, slot) =>
              value === 2 ? otherLastLazyValue(value, slot) : SKIP_ITEM,
            ),
          ],
        ),
      ).toStrictEqual([2]);
    });

    it('a stop', async () => {
      vi.resetModules();
      const { STOP: otherStop } = await import('./make-stoppable');

      expect(
        runFusedSequence([1, 2, 3], [step(() => otherStop)]),
      ).toStrictEqual([]);
    });
  });
});

const lazy = (): LazyUnaryFunction => lazyFunction(() => (value) => value);

const lazyFunction = (
  lazyImplementation: LazyEvaluatorFactory<ReadonlyArray<unknown>, never>,
): LazyUnaryFunction =>
  lazyDataLastImplementation(
    () => {
      throw new Error(
        'Intentional! a fused sequence doesn\'t call the data-first',
      );
    },
    // @ts-expect-error [ts2345] -- These functions take no arguments, so the empty ones can stand in for the `never` of the default `LazyUnaryFunction`, which is what lets it hold any lazy function.
    [],
    lazyImplementation,
  );

const step = (lazyEvaluator: StoppableLazyEvaluator = (value) => value) =>
  ({
    lazyEvaluator,
    itemIndex: 0,
    requiresData: false,
    data: UNEXPECTED_ACCESS_SENTINEL,
  }) as const satisfies LazyStep;

const stepWithData = (lazyEvaluator: LazyEvaluator) =>
  ({
    lazyEvaluator,
    itemIndex: 0,
    requiresData: true,
    data: [],
  }) as const satisfies LazyStep;

// Never finishes on its own, so only a loop that stops pulling can consume it.
function* naturals(): Generator<number> {
  for (let value = 0; ; value++) {
    yield value;
  }
}

// A `for...of` that exits early closes the generator, which runs its `finally`.
function* closesWith(onClose: () => void): Generator<number> {
  try {
    yield* [1, 2, 3];
  } finally {
    onClose();
  }
}
