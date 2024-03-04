import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: ['src/index.ts', 'src/_*.ts'],
      include: ['src/*.ts'],
    },

    globals: true,
  },
});
