import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**'],
      exclude: [
        'src/**/*.spec-d.ts',
        'src/**/*.spec-prop.ts',
        'src/index.ts',
        'src/internal/types/**/*.ts',
      ],
    },
    projects: [
      {
        test: {
          name: 'runtime',
          include: ['src/**/*.spec.ts'],
          isolate: false,
        },
      },
      {
        test: {
          name: 'types',
          include: ['src/**/*.spec-d.ts'],
          typecheck: {
            enabled: true,
            only: true,
            ignoreSourceErrors: true,
          },
        },
      },
      {
        test: {
          name: 'prop',
          include: ['src/**/*.spec-prop.ts'],
          isolate: false,
        },
      },
    ],
  },
});
