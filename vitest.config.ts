import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: ['src/index.ts', 'src/**/*.test-d.ts'],
      include: ['src/**'],
    },
    globals: true,
  },
});
