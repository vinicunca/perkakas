import type { JSONOutput } from 'typedoc';

import { groupBy, pipe } from '@vinicunca/perkakas';
import DATA from '@vinicunca/perkakas/dist/metadata.json' assert { type: 'json' };

import { transformProject } from './perkakas.transform';

export const CATEGORIZED = pipe(
  DATA as JSONOutput.ProjectReflection,
  transformProject,
  groupBy(
    ({ category }) =>
      category
      ?? 'Other',
  ),
);

export const PERKAKAS_METHODS = transformProject(DATA as JSONOutput.ProjectReflection);
