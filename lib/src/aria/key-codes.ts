/**
 * Using event.code is not predictable since each machine may have different output
 */

export const KEY_CODES = {
  TAB: 'Tab',
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ENTER: 'Enter',
  ESC: 'Escape',
  SPACE: 'Space',
  SHIFT: 'Shift',
  KEY_F: 'KEY_F',
  CTRL: 'Control',
  ALT: 'Alt',
  META: 'Meta',
  AT: '@',
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const;

