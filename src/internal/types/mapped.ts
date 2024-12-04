import type { IterableContainer } from './iterable-container';

export type Mapped<T extends IterableContainer, K> = {
  -readonly [P in keyof T]: K;
};
