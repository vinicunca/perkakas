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

    const keyFn = vi.fn(identity());
    const valueFn = vi.fn(identity());

    pullObject(data, keyFn, valueFn);

    expect(keyFn).toHaveBeenCalledTimes(data.length);
    expect(valueFn).toHaveBeenCalledTimes(data.length);
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

    const keyFn = vi.fn(identity());
    const valueFn = vi.fn(identity());

    pipe(data, pullObject(keyFn, valueFn));

    expect(keyFn).toHaveBeenCalledTimes(data.length);
    expect(valueFn).toHaveBeenCalledTimes(data.length);
  });
});
