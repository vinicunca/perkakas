import { mergeAll } from './merge-all';

it('merge objects', () => {
  expect(
    mergeAll([{ a: 1, b: 1 }, { b: 2, c: 3 }, { d: 10 }] as const),
  ).toEqual({
    a: 1,
    b: 2,
    c: 3,
    d: 10,
  });
});
