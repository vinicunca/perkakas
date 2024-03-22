import { groupBy, map, pipe, toPairs } from '@vinicunca/perkakas';

import { PERKAKAS_METHODS } from '../perkakas/perkakas.metadata';
import { getTags } from '../perkakas/perkakas.utils';

const NAVBAR_ENTRIES = pipe(
  PERKAKAS_METHODS,
  groupBy(
    ({ category }) =>
      category
      ?? 'Other',
  ),
  toPairs,
  map(
    ([category, funcs]) => {
      return {
        items: funcs.map((func) => ({
          link: `/perkakas/docs/${func.name}`,
          tags: getTags(func),
          text: func.name,
        })),
        text: category,
      };
    },
  ),
);

export const perkakasSidebar = NAVBAR_ENTRIES;
