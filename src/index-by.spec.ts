import { indexBy } from './index-by';
import { pipe } from './pipe';
import { prop } from './prop';

it('dataFirst', () => {
  expect(
    indexBy(
      [
        { dir: 'left', code: 97 },
        { dir: 'right', code: 100 },
      ],
      prop('code'),
    ),
  ).toStrictEqual({
    97: { dir: 'left', code: 97 },
    100: { dir: 'right', code: 100 },
  });
});

it('dataLast', () => {
  expect(
    pipe(
      [
        { dir: 'left', code: 97 },
        { dir: 'right', code: 100 },
      ],
      indexBy(prop('code')),
    ),
  ).toStrictEqual({
    97: { dir: 'left', code: 97 },
    100: { dir: 'right', code: 100 },
  });
});
