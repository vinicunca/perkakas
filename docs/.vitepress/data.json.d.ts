import type { DocumentedFunction } from './data/perkakas.transform';

declare module 'vitepress' {
  interface PageData {
    functions: Array<DocumentedFunction>;
  }
}
