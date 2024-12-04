import { sliceString } from './slice-string';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

describe('dataFirst', () => {
  describe('indexStart', () => {
    it('empty string, 0 indexStart', () => {
      expect(sliceString('', 0)).toBe('');
    });

    it('empty string, >0 indexStart', () => {
      expect(sliceString('', 100)).toBe('');
    });

    it('empty string, <0 indexStart', () => {
      expect(sliceString('', -100)).toBe('');
    });

    it('alphabet, 0 indexStart', () => {
      expect(sliceString(ALPHABET, 0)).toBe(ALPHABET);
    });

    it('alphabet, >0 indexStart, <len', () => {
      expect(sliceString(ALPHABET, 10)).toBe('klmnopqrstuvwxyz');
    });

    it('alphabet, <0 indexStart, >-len', () => {
      expect(sliceString(ALPHABET, -10)).toBe('qrstuvwxyz');
    });

    it('alphabet, >0 indexStart, >len', () => {
      expect(sliceString(ALPHABET, 100)).toBe('');
    });

    it('alphabet, <0 indexStart, <-len', () => {
      expect(sliceString(ALPHABET, -100)).toBe(ALPHABET);
    });
  });

  describe('indexEnd', () => {
    it('empty string, 0 indexStart, 0 indexEnd', () => {
      expect(sliceString('', 0, 0)).toBe('');
    });

    it('alphabet, 0 indexStart, 0 indexEnd', () => {
      expect(sliceString(ALPHABET, 0, 0)).toBe('');
    });

    it('alphabet, 0 indexStart, >indexStart indexEnd <len', () => {
      expect(sliceString(ALPHABET, 0, 10)).toBe('abcdefghij');
    });

    it('alphabet, 0 indexStart, >indexStart indexEnd >len', () => {
      expect(sliceString(ALPHABET, 0, 100)).toBe(ALPHABET);
    });

    it('alphabet, 0 indexStart, <indexStart indexEnd >-len', () => {
      expect(sliceString(ALPHABET, 0, -10)).toBe('abcdefghijklmnop');
    });

    it('alphabet, 0 indexStart <len, <indexStart indexEnd <-len', () => {
      expect(sliceString(ALPHABET, 0, -100)).toBe('');
    });

    it('alphabet, >0 indexStart <len, >indexStart indexEnd <len', () => {
      expect(sliceString(ALPHABET, 10, 20)).toBe('klmnopqrst');
    });

    it('alphabet, >0 indexStart <len, >indexStart indexEnd >len', () => {
      expect(sliceString(ALPHABET, 10, 100)).toBe('klmnopqrstuvwxyz');
    });

    it('alphabet, >0 indexStart <len, <indexStart indexEnd >-len', () => {
      expect(sliceString(ALPHABET, 10, 5)).toBe('');
    });

    it('alphabet, >0 indexStart <len, <indexStart indexEnd <-len', () => {
      expect(sliceString(ALPHABET, 10, -100)).toBe('');
    });

    it('alphabet, >0 indexStart >len, >indexStart indexEnd >len', () => {
      expect(sliceString(ALPHABET, 100, 200)).toBe('');
    });

    it('alphabet, >0 indexStart >len, <indexStart indexEnd >-len', () => {
      expect(sliceString(ALPHABET, 100, 5)).toBe('');
    });

    it('alphabet, >0 indexStart >len, <indexStart indexEnd <-len', () => {
      expect(sliceString(ALPHABET, 100, -100)).toBe('');
    });
  });
});

describe('dataLast', () => {
  describe('indexStart', () => {
    it('empty string, 0 indexStart', () => {
      expect(sliceString(0)('')).toBe('');
    });

    it('empty string, >0 indexStart', () => {
      expect(sliceString(100)('')).toBe('');
    });

    it('empty string, <0 indexStart', () => {
      expect(sliceString(-100)('')).toBe('');
    });

    it('alphabet, 0 indexStart', () => {
      expect(sliceString(0)(ALPHABET)).toBe(ALPHABET);
    });

    it('alphabet, >0 indexStart, <len', () => {
      expect(sliceString(10)(ALPHABET)).toBe('klmnopqrstuvwxyz');
    });

    it('alphabet, <0 indexStart, >-len', () => {
      expect(sliceString(-10)(ALPHABET)).toBe('qrstuvwxyz');
    });

    it('alphabet, >0 indexStart, >len', () => {
      expect(sliceString(100)(ALPHABET)).toBe('');
    });

    it('alphabet, <0 indexStart, <-len', () => {
      expect(sliceString(-100)(ALPHABET)).toBe(ALPHABET);
    });
  });

  describe('indexEnd', () => {
    it('empty string, 0 indexStart, 0 indexEnd', () => {
      expect(sliceString(0, 0)('')).toBe('');
    });

    it('alphabet, 0 indexStart, 0 indexEnd', () => {
      expect(sliceString(0, 0)(ALPHABET)).toBe('');
    });

    it('alphabet, 0 indexStart, >indexStart indexEnd <len', () => {
      expect(sliceString(0, 10)(ALPHABET)).toBe('abcdefghij');
    });

    it('alphabet, 0 indexStart, >indexStart indexEnd >len', () => {
      expect(sliceString(0, 100)(ALPHABET)).toBe(ALPHABET);
    });

    it('alphabet, 0 indexStart, <indexStart indexEnd >-len', () => {
      expect(sliceString(0, -10)(ALPHABET)).toBe('abcdefghijklmnop');
    });

    it('alphabet, 0 indexStart <len, <indexStart indexEnd <-len', () => {
      expect(sliceString(0, -100)(ALPHABET)).toBe('');
    });

    it('alphabet, >0 indexStart <len, >indexStart indexEnd <len', () => {
      expect(sliceString(10, 20)(ALPHABET)).toBe('klmnopqrst');
    });

    it('alphabet, >0 indexStart <len, >indexStart indexEnd >len', () => {
      expect(sliceString(10, 100)(ALPHABET)).toBe('klmnopqrstuvwxyz');
    });

    it('alphabet, >0 indexStart <len, <indexStart indexEnd >-len', () => {
      expect(sliceString(10, 5)(ALPHABET)).toBe('');
    });

    it('alphabet, >0 indexStart <len, <indexStart indexEnd <-len', () => {
      expect(sliceString(10, -100)(ALPHABET)).toBe('');
    });

    it('alphabet, >0 indexStart >len, >indexStart indexEnd >len', () => {
      expect(sliceString(100, 200)(ALPHABET)).toBe('');
    });

    it('alphabet, >0 indexStart >len, <indexStart indexEnd >-len', () => {
      expect(sliceString(100, 5)(ALPHABET)).toBe('');
    });

    it('alphabet, >0 indexStart >len, <indexStart indexEnd <-len', () => {
      expect(sliceString(100, -100)(ALPHABET)).toBe('');
    });
  });
});
