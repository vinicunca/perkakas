import { entries, groupBy, map, pipe } from '@vinicunca/perkakas';

import { PERKAKAS_METHODS } from '../data/perkakas.metadata';
import { getTags } from '../data/perkakas.utils';

const grouped = pipe(
  PERKAKAS_METHODS,
  groupBy(
    ({ category }) =>
      category
      ?? 'Other',
  ),
);

const groupedEntries = entries(grouped);

export const NAVBAR_ENTRIES = map(
  groupedEntries,
  ([category, funcs]) => {
    return {
      items: funcs.map((func) => ({
        link: `/docs#${func.name.toLowerCase()}`,
        tags: getTags(func),
        text: func.name,
      })),
      text: category as string,
    };
  },
);
