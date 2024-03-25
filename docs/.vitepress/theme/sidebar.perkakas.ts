import { entries, groupBy, map, pipe } from '@vinicunca/perkakas';

import { PERKAKAS_METHODS } from '../perkakas/perkakas.metadata';
import { getTags } from '../perkakas/perkakas.utils';

const grouped = pipe(
  PERKAKAS_METHODS,
  groupBy(
    ({ category }) =>
      category
      ?? 'Other',
  ),
);

const groupedEntries = entries.strict(grouped);

const NAVBAR_ENTRIES = map(
  groupedEntries,
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
);

export const perkakasSidebar = NAVBAR_ENTRIES;
