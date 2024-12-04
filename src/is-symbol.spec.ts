import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from '../test/types-data-provider';
import { isSymbol } from './is-symbol';

it('should work as type guard', () => {
  expect(isSymbol(TYPES_DATA_PROVIDER.symbol)).toBe(true);
});

it('should work as type guard in array', () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isSymbol);

  expect(data.every((c) => typeof c === 'symbol')).toBe(true);
});
