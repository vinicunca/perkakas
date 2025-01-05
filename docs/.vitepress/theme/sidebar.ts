import { map, pipe } from '@vinicunca/perkakas';

import { CATEGORIZED } from '../data/perkakas.metadata';
import { getTags } from '../data/perkakas.utils';

export const NAVBAR_ENTRIES = pipe(
  CATEGORIZED,
  map(
    ([category, funcs]) => {
      return {
        items: funcs.map((func) => ({
          link: `/docs#${func.name}`,
          tags: getTags(func),
          text: func.name,
        })),
        text: category as string,
      };
    },
  ),
);
