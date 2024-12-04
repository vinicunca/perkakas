import { constant } from './constant';
import { pickBy } from './pick-by';
import { pipe } from './pipe';

it('dataFirst', () => {
  expect(
    pickBy({ a: 1, b: 2, A: 3, B: 4 }, (_, key) => key.toUpperCase() === key),
  ).toStrictEqual({ A: 3, B: 4 });
});

it('dataLast', () => {
  expect(
    pipe(
      { a: 1, b: 2, A: 3, B: 4 },
      pickBy((_, key) => key.toUpperCase() === key),
    ),
  ).toStrictEqual({ A: 3, B: 4 });
});

it('symbols are filtered out', () => {
  const mySymbol = Symbol('mySymbol');
  expect(pickBy({ [mySymbol]: 1 }, constant(true))).toStrictEqual({});
});

it('symbols are not passed to the predicate', () => {
  const mock = vi.fn();
  const data = { [Symbol('mySymbol')]: 1, a: 'hello' };
  pickBy(data, mock);
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toBeCalledWith('hello', 'a', data);
});
