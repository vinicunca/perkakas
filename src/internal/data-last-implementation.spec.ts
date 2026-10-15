import { expect, it } from 'vitest';
import { dataLastImplementation } from './data-last-implementation';

it.each([[[]], [[1]], [[1, 2]]])(
  'passes the data and every argument of %j through',
  (args) => {
    expect(
      dataLastImplementation(collectArguments, args)('data'),
    ).toStrictEqual(['data', ...args]);
  },
);

function collectArguments(...args: ReadonlyArray<unknown>): ReadonlyArray<unknown> {
  return args;
}
