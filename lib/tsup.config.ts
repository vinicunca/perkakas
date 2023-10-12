import { defineConfig } from 'tsup';

export default defineConfig({
  onSuccess: 'esbuild --minify --sourcemap ./dist/index.js --outfile=./dist/index.min.js',
});
