import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/*.ts',
    // Skip test files
    '!**/*.spec{,-d}.ts',
  ],

  format: ['esm', 'cjs'],

  dts: {
    sourcemap: true,
  },

  // We support both client and server envs
  platform: 'neutral',

  minify: true,

  attw: true,
  publint: true,

  failOnWarn: true,
});
