import { describe, expect, it, vi } from 'vitest';
import { add } from './add';
import { constant } from './constant';
import { identity } from './identity';
import { pipe } from './pipe';
import { prop } from './prop';
import { pullObject } from './pull-object';

describe('dataFirst', () => {
  it('empty array', () => {
    expect(pullObject([], constant('key'), constant('value'))).toStrictEqual(
      {},
    );
  });

  it('number items', () => {
    expect(pullObject([1, 2], (item) => `item_${item}`, add(2))).toStrictEqual({
      item_1: 3,
      item_2: 4,
    });
  });

  it('string items', () => {
    expect(
      pullObject(
        ['a', 'b'],
        (item) => `item_${item}`,
        (item) => item.toUpperCase(),
      ),
    ).toStrictEqual({ item_a: 'A', item_b: 'B' });
  });

  it('object items', () => {
    expect(
      pullObject(
        [
          { key: 'a', value: 1 },
          { key: 'b', value: 2 },
        ],
        prop('key'),
        prop('value'),
      ),
    ).toStrictEqual({ a: 1, b: 2 });
  });

  it('number keys', () => {
    expect(
      pullObject(['a', 'aa'], (item) => item.length, identity()),
    ).toStrictEqual({
      1: 'a',
      2: 'aa',
    });
  });

  it('undefined values', () => {
    expect(pullObject(['a'], identity(), constant(undefined))).toStrictEqual({
      a: undefined,
    });
  });

  it('last value wins', () => {
    expect(
      pullObject(
        [
          { id: 'a', val: 'hello' },
          { id: 'a', val: 'world' },
        ],
        prop('id'),
        prop('val'),
      ),
    ).toStrictEqual({ a: 'world' });
  });

  it('guaranteed to run on each item', () => {
    const data = ['a', 'a', 'a', 'a', 'a', 'a'];

    const keyFn = vi.fn<(x: string) => string>();
    const valueFn = vi.fn<(x: string) => string>();

    pullObject(data, keyFn, valueFn);

    expect(keyFn).toHaveBeenCalledTimes(data.length);
    expect(valueFn).toHaveBeenCalledTimes(data.length);
  });

  it('single item', () => {
    expect(pullObject(['a'], identity(), constant(1))).toStrictEqual({ a: 1 });
  });

  it('prototype is Object.prototype', () => {
    expect(
      Object.getPrototypeOf(pullObject(['a'], identity(), constant(1))),
    ).toBe(Object.prototype);
  });

  describe('`__proto__` key', () => {
    it('keeps the prototype', () => {
      expect(
        Object.getPrototypeOf(
          pullObject(['__proto__'], identity(), constant({ a: 1 })),
        ),
      ).toBe(Object.prototype);
    });

    it('with an object value is an own property', () => {
      expect(
        Reflect.ownKeys(
          pullObject(['__proto__'], identity(), constant({ a: 1 })),
        ),
      ).toStrictEqual(['__proto__']);
    });

    it('with a primitive value is an own property', () => {
      expect(
        Object.entries(pullObject(['__proto__'], identity(), constant(1))),
      ).toStrictEqual([
        ['__proto__', 1],
      ]);
    });
  });

  it('a repeated key keeps its first position', () => {
    expect(
      Object.entries(
        pullObject(['b', 'a', 'b'], identity(), (_, index) => index),
      ),
    ).toStrictEqual([
      ['b', 2],
      ['a', 1],
    ]);
  });

  it('number keys share the property of their string form', () => {
    expect(
      pullObject([1, '1'], identity(), (item) => typeof item),
    ).toStrictEqual({ 1: 'string' });
  });

  it('key order', () => {
    const mySymbol = Symbol('mySymbol');

    expect(
      Reflect.ownKeys(
        pullObject(
          ['b', '10', mySymbol, 'a', '2', 'b'],
          identity(),
          constant(1),
        ),
      ),
    ).toStrictEqual(['2', '10', 'b', 'a', mySymbol]);
  });

  it('calls the extractors in turn for each item', () => {
    const calls: Array<string> = [];

    pullObject(
      ['a', 'b'],
      (item) => {
        calls.push(`key ${item}`);
        return item;
      },
      (item) => {
        calls.push(`value ${item}`);
        return item;
      },
    );

    expect(calls).toStrictEqual(['key a', 'value a', 'key b', 'value b']);
  });

  it('calls the key extractor once per item, in order, with the whole input', () => {
    const data = ['a', 'b', 'c'];
    const keyExtractor
      = vi.fn<(item: string, index: number, data: ReadonlyArray<string>) => string>(
        identity(),
      );

    pullObject(data, keyExtractor, constant(1));

    expect(keyExtractor.mock.calls).toStrictEqual([
      ['a', 0, data],
      ['b', 1, data],
      ['c', 2, data],
    ]);
  });

  it('calls the value extractor once per item, in order, with the whole input', () => {
    const data = ['a', 'b', 'c'];
    const valueExtractor = vi.fn<
      (item: string, index: number, data: ReadonlyArray<string>) => number
    >(constant(1));

    pullObject(data, identity(), valueExtractor);

    expect(valueExtractor.mock.calls).toStrictEqual([
      ['a', 0, data],
      ['b', 1, data],
      ['c', 2, data],
    ]);
  });
});

describe('dataLast', () => {
  it('empty array', () => {
    expect(
      pipe([], pullObject(constant('key'), constant('value'))),
    ).toStrictEqual({});
  });

  it('number items', () => {
    expect(
      pipe(
        [1, 2],
        pullObject((item) => `item_${item}`, add(2)),
      ),
    ).toStrictEqual({ item_1: 3, item_2: 4 });
  });

  it('string items', () => {
    expect(
      pipe(
        ['a', 'b'],
        pullObject(
          (item) => `item_${item}`,
          (item) => item.toUpperCase(),
        ),
      ),
    ).toStrictEqual({ item_a: 'A', item_b: 'B' });
  });

  it('object items', () => {
    expect(
      pipe(
        [
          { key: 'a', value: 1 },
          { key: 'b', value: 2 },
        ],
        pullObject(prop('key'), prop('value')),
      ),
    ).toStrictEqual({ a: 1, b: 2 });
  });

  it('number keys', () => {
    expect(
      pipe(
        ['a', 'aa'],
        pullObject((item) => item.length, identity()),
      ),
    ).toStrictEqual({ 1: 'a', 2: 'aa' });
  });

  it('undefined values', () => {
    expect(
      pipe(['a'], pullObject(identity(), constant(undefined))),
    ).toStrictEqual({
      a: undefined,
    });
  });

  it('last value wins', () => {
    expect(
      pipe(
        [
          { id: 'a', val: 'hello' },
          { id: 'a', val: 'world' },
        ],
        pullObject(prop('id'), prop('val')),
      ),
    ).toStrictEqual({ a: 'world' });
  });

  it('guaranteed to run on each item', () => {
    const data = ['a', 'a', 'a', 'a', 'a', 'a'];

    const keyFn = vi.fn<(x: string) => string>();
    const valueFn = vi.fn<(x: string) => string>();

    pipe(data, pullObject(keyFn, valueFn));

    expect(keyFn).toHaveBeenCalledTimes(data.length);
    expect(valueFn).toHaveBeenCalledTimes(data.length);
  });

  it('prototype is Object.prototype', () => {
    expect(
      Object.getPrototypeOf(pipe(['a'], pullObject(identity(), constant(1)))),
    ).toBe(Object.prototype);
  });
});
