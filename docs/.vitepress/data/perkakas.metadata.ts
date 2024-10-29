import { groupBy, pipe } from '@vinicunca/perkakas';

import PERKAKAS_METADATA from './metadata.json';
import { transformProject } from './perkakas.transform';

export const PERKAKAS_METHODS = transformProject(PERKAKAS_METADATA);

export const CATEGORIZED = pipe(
  PERKAKAS_METHODS,
  groupBy(
    ({ category }) =>
      category ?? 'Other',
  ),
);
