import { forEachObj } from './for-each-obj';
import { pipe } from './pipe';

it('dataFirst', () => {
  const data = {
    a: 1,
    b: 2,
    c: 3,
  };
  const cb = vi.fn();

  forEachObj(data, cb);

  expect(cb).toHaveBeenCalledWith(1, 'a', data);
  expect(cb).toHaveBeenCalledWith(2, 'b', data);
  expect(cb).toHaveBeenCalledWith(3, 'c', data);
});

it('doesn\'t run on symbol keys', () => {
  const data = { [Symbol('a')]: 4 };
  const cb = vi.fn();

  forEachObj(data, cb);

  expect(cb).toHaveBeenCalledTimes(0);
});

it('number keys are translated to string', () => {
  const data = { 123: 456 };
  forEachObj(data, (value, key) => {
    expect(key).toBe('123');
    expect(value).toBe(456);
  });
});

it('dataLast', () => {
  const data = { a: 1, b: 2, c: 3 };
  const cb = vi.fn();

  expect(pipe(data, forEachObj(cb))).toBe(data);
  expect(cb).toHaveBeenCalledWith(1, 'a', data);
  expect(cb).toHaveBeenCalledWith(2, 'b', data);
  expect(cb).toHaveBeenCalledWith(3, 'c', data);
});
