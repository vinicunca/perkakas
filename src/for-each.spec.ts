import { forEach } from './for-each';
import { pipe } from './pipe';
import { take } from './take';

describe('runtime', () => {
  it('dataFirst', () => {
    const data = [1, 2, 3];
    const cb = vi.fn();

    forEach(data, cb);

    expect(cb).toHaveBeenCalledWith(1, 0, data);
    expect(cb).toHaveBeenCalledWith(2, 1, data);
    expect(cb).toHaveBeenCalledWith(3, 2, data);
  });

  it('dataLast', () => {
    const data = [1, 2, 3];
    const cb = vi.fn();

    const result = forEach(cb)(data);

    expect(cb).toHaveBeenCalledWith(1, 0, data);
    expect(cb).toHaveBeenCalledWith(2, 1, data);
    expect(cb).toHaveBeenCalledWith(3, 2, data);

    // dataLast used directly, we return the same reference.
    expect(result).toBe(data);
  });

  it('pipe', () => {
    const data = [1, 2, 3];
    const cb = vi.fn();

    const result = pipe(data, forEach(cb));

    expect(cb).toHaveBeenCalledWith(1, 0, data);
    expect(cb).toHaveBeenCalledWith(2, 1, data);
    expect(cb).toHaveBeenCalledWith(3, 2, data);

    expect(result).toStrictEqual(data);
    // The pipe reconstructs the array.
    expect(result).not.toBe(data);
  });

  it('with take', () => {
    const count = vi.fn();
    const result = pipe(
      [1, 2, 3],
      forEach(() => {
        count();
      }),
      take(2),
    );
    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toEqual([1, 2]);
  });
});
