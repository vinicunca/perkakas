import process from 'node:process';
import { resolve } from 'pathe';

import JITI from 'jiti';

export default defineEventHandler(async () => {
  const cwd = process.cwd();
  const metadataPath = resolve(cwd, 'build', 'data.json');

  const jiti = JITI(cwd);

  const metaDocs = jiti(metadataPath).default;

  return {
    metaDocs,
  };
});
