import { describe, expect, it } from 'vitest';
import { canReadData, requireData, requireDataByArity } from './require-data';

describe(requireData, () => {
  it('marks the evaluator', () => {
    expect(requireData((value) => value).requiresData).toBe(true);
  });
});

describe(requireDataByArity, () => {
  it('marks the evaluator when the callback declares `data`', () => {
    expect(
      requireDataByArity(declaresData, (value) => value).requiresData,
    ).toBe(true);
  });

  it('leaves the evaluator unmarked when the callback doesn\'t declare `data`', () => {
    expect(
      requireDataByArity(ignoresData, (value) => value).requiresData,
    ).toBeUndefined();
  });
});

describe(canReadData, () => {
  it('treats a rest-parameter callback as reading `data` because its `Function.length` is 0', () => {
    expect(canReadData((...args: ReadonlyArray<unknown>) => args[2])).toBe(true);
  });

  it('judges a callback bound with partial application by its remaining arity', () => {
    expect(canReadData(ignoresDataAfterTag.bind(undefined, 't'))).toBe(false);
  });
});

describe('known issues!', () => {
  describe('`canReadData` known foot guns', () => {
    it('a trailing rest parameter', () => {
      const canRead = canReadData(
        (_value, _index, ...rest: readonly [ReadonlyArray<number>]) =>
          rest[0].length,
      );

      expect(canRead).not.toBe(true);

      // Actual
      expect(canRead).toBe(false);
    });

    it('default parameters', () => {
      const canRead = canReadData(
        (_value, _index = 0, data: ReadonlyArray<number> = []) => data.length,
      );

      expect(canRead).not.toBe(true);

      // Actual
      expect(canRead).toBe(false);
    });

    it('`arguments` access', () => {
      const canRead = canReadData(function readsArguments(_) {
        // eslint-disable-next-line prefer-rest-params -- The point of this test is that arguments-based access is invisible to the arity check.
        return arguments[2];
      });

      expect(canRead).not.toBe(true);

      // Actual
      expect(canRead).toBe(false);
    });
  });
});

function declaresData(value: number, _index: number, data: ReadonlyArray<number>): number {
  return value + data.length;
}

function ignoresData(value: number, index: number): number {
  return value + index;
}

function ignoresDataAfterTag(tag: string, value: number, index: number): ReadonlyArray<unknown> {
  return [tag, value, index];
}
