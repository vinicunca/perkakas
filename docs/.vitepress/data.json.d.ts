import type { DocumentedFunction } from './perkakas/perkakas.transform';

declare module 'vitepress' {
  interface PageData {
    func: DocumentedFunction;
  }
}
