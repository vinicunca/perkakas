/**
 * Using event.code is not predictable since each machine may have different output
 */

export const KEY_CODES = {
  ALT: 'Alt',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_UP: 'ArrowUp',
  AT: '@',
  BACKSPACE: 'Backspace',
  CTRL: 'Control',
  DELETE: 'Delete',
  END: 'End',
  ENTER: 'Enter',
  ESC: 'Escape',
  HOME: 'Home',
  KEY_F: 'KEY_F',
  META: 'Meta',
  PAGE_DOWN: 'PageDown',
  PAGE_UP: 'PageUp',
  SHIFT: 'Shift',
  SPACE: 'Space',
  TAB: 'Tab',
} as const;
