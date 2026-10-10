# @vinicunca/perkakas

[![npm](https://img.shields.io/npm/v/@vinicunca/perkakas/latest.svg?style=flat&colorA=18181B&colorB=28CF8D)](https://npmjs.com/package/@vinicunca/perkakas)
[![downloads](https://img.shields.io/npm/dm/@vinicunca/perkakas.svg?style=flat&colorA=18181B&colorB=28CF8D)](https://npmjs.com/package/@vinicunca/perkakas)
[![license](https://img.shields.io/github/license/vinicunca/perkakas.svg?style=flat&colorA=18181B&colorB=28CF8D)](https://github.com/vinicunca/perkakas/blob/main/LICENSE)

A typed, data-first and data-last utility library for TypeScript.

```bash
pnpm add @vinicunca/perkakas
```

```ts
import { filter, map, pipe } from '@vinicunca/perkakas';

pipe(
  [1, 2, 3, 4],
  filter((n) => n % 2 === 0),
  map((n) => n * 2),
);
```

Documentation: https://vinicunca.dev/perkakas

Perkakas is a fork of [Remeda](https://github.com/remeda/remeda). MIT licensed.
