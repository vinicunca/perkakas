import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const entries = [
  'src/index.ts',
];

const plugins = [
  alias({
    entries: [
      { find: /^node:(.+)$/, replacement: '$1' },
    ],
  }),
  resolve({
    preferBuiltins: true,
  }),
  esbuild({
    target: 'node14',
  }),
];

export default [
  ...entries.map((input) => ({
    input,
    output: [
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.mjs'),
        format: 'esm',
      },
    ],
    plugins,
  })),
  ...entries.map((input) => ({
    input,
    output: [
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.d.mts'),
        format: 'esm',
      },
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.d.ts'),
        format: 'esm',
      },
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.d.cts'),
        format: 'cjs',
      },
    ],
    plugins: [
      dts({ respectExternal: true }),
    ],
  })),
];
