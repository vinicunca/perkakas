# Installation

## Setup

::: code-group

```sh [npm]
$ npm add -D @vinicunca/perkakas
```

```sh [pnpm]
$ pnpm add -D @vinicunca/perkakas
```

```sh [bun]
$ bun add -D @vinicunca/perkakas
```

:::

::: tip Requirements

- Node.js v20.x and above

:::

## Usage

You can import the functions as a global or using named imports:

```ts
import * as P from '@vinicunca/perkakas';

P.add(10, 5);

// or

import { add } from '@vinicunca/perkakas';

add(10, 5);
```
