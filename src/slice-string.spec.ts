import { sliceString } from './slice-string';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

describe('dataFirst', () => {
  describe('indexStart', () => {
    it('empty string, 0 indexStart', () => {
      expect(sliceString('', 0)).toEqual('');
    });

    it('empty string, >0 indexStart', () => {
      expect(sliceString('', 100)).toEqual('');
    });

    it('empty string, <0 indexStart', () => {
      expect(sliceString('', -100)).toEqual('');
    });

    it('alphabet, 0 indexStart', () => {
      expect(sliceString(ALPHABET, 0)).toEqual(ALPHABET);
    });

    it('alphabet, >0 indexStart, <len', () => {
      expect(sliceString(ALPHABET, 10)).toEqual('klmnopqrstuvwxyz');
    });

    it('alphabet, <0 indexStart, >-len', () => {
      expect(sliceString(ALPHABET, -10)).toEqual('qrstuvwxyz');
    });

    it('alphabet, >0 indexStart, >len', () => {
      expect(sliceString(ALPHABET, 100)).toEqual('');
    });

    it('alphabet, <0 indexStart, <-len', () => {
      expect(sliceString(ALPHABET, -100)).toEqual(ALPHABET);
    });
  });

  describe('indexEnd', () => {
    it('empty string, 0 indexStart, 0 indexEnd', () => {
      expect(sliceString('', 0, 0)).toEqual('');
    });

    it('alphabet, 0 indexStart, 0 indexEnd', () => {
      expect(sliceString(ALPHABET, 0, 0)).toEqual('');
    });

    it('alphabet, 0 indexStart, >indexStart indexEnd <len', () => {
      expect(sliceString(ALPHABET, 0, 10)).toEqual('abcdefghij');
    });

    it('alphabet, 0 indexStart, >indexStart indexEnd >len', () => {
      expect(sliceString(ALPHABET, 0, 100)).toEqual(ALPHABET);
    });

    it('alphabet, 0 indexStart, <indexStart indexEnd >-len', () => {
      expect(sliceString(ALPHABET, 0, -10)).toEqual('abcdefghijklmnop');
    });

    it('alphabet, 0 indexStart <len, <indexStart indexEnd <-len', () => {
      expect(sliceString(ALPHABET, 0, -100)).toEqual('');
    });

    it('alphabet, >0 indexStart <len, >indexStart indexEnd <len', () => {
      expect(sliceString(ALPHABET, 10, 20)).toEqual('klmnopqrst');
    });

    it('alphabet, >0 indexStart <len, >indexStart indexEnd >len', () => {
      expect(sliceString(ALPHABET, 10, 100)).toEqual('klmnopqrstuvwxyz');
    });

    it('alphabet, >0 indexStart <len, <indexStart indexEnd >-len', () => {
      expect(sliceString(ALPHABET, 10, 5)).toEqual('');
    });

    it('alphabet, >0 indexStart <len, <indexStart indexEnd <-len', () => {
      expect(sliceString(ALPHABET, 10, -100)).toEqual('');
    });

    it('alphabet, >0 indexStart >len, >indexStart indexEnd >len', () => {
      expect(sliceString(ALPHABET, 100, 200)).toEqual('');
    });

    it('alphabet, >0 indexStart >len, <indexStart indexEnd >-len', () => {
      expect(sliceString(ALPHABET, 100, 5)).toEqual('');
    });

    it('alphabet, >0 indexStart >len, <indexStart indexEnd <-len', () => {
      expect(sliceString(ALPHABET, 100, -100)).toEqual('');
    });
  });
});

describe('dataLast', () => {
  describe('indexStart', () => {
    it('empty string, 0 indexStart', () => {
      expect(sliceString(0)('')).toEqual('');
    });

    it('empty string, >0 indexStart', () => {
      expect(sliceString(100)('')).toEqual('');
    });

    it('empty string, <0 indexStart', () => {
      expect(sliceString(-100)('')).toEqual('');
    });

    it('alphabet, 0 indexStart', () => {
      expect(sliceString(0)(ALPHABET)).toEqual(ALPHABET);
    });

    it('alphabet, >0 indexStart, <len', () => {
      expect(sliceString(10)(ALPHABET)).toEqual('klmnopqrstuvwxyz');
    });

    it('alphabet, <0 indexStart, >-len', () => {
      expect(sliceString(-10)(ALPHABET)).toEqual('qrstuvwxyz');
    });

    it('alphabet, >0 indexStart, >len', () => {
      expect(sliceString(100)(ALPHABET)).toEqual('');
    });

    it('alphabet, <0 indexStart, <-len', () => {
      expect(sliceString(-100)(ALPHABET)).toEqual(ALPHABET);
    });
  });

  describe('indexEnd', () => {
    it('empty string, 0 indexStart, 0 indexEnd', () => {
      expect(sliceString(0, 0)('')).toEqual('');
    });

    it('alphabet, 0 indexStart, 0 indexEnd', () => {
      expect(sliceString(0, 0)(ALPHABET)).toEqual('');
    });

    it('alphabet, 0 indexStart, >indexStart indexEnd <len', () => {
      expect(sliceString(0, 10)(ALPHABET)).toEqual('abcdefghij');
    });

    it('alphabet, 0 indexStart, >indexStart indexEnd >len', () => {
      expect(sliceString(0, 100)(ALPHABET)).toEqual(ALPHABET);
    });

    it('alphabet, 0 indexStart, <indexStart indexEnd >-len', () => {
      expect(sliceString(0, -10)(ALPHABET)).toEqual('abcdefghijklmnop');
    });

    it('alphabet, 0 indexStart <len, <indexStart indexEnd <-len', () => {
      expect(sliceString(0, -100)(ALPHABET)).toEqual('');
    });

    it('alphabet, >0 indexStart <len, >indexStart indexEnd <len', () => {
      expect(sliceString(10, 20)(ALPHABET)).toEqual('klmnopqrst');
    });

    it('alphabet, >0 indexStart <len, >indexStart indexEnd >len', () => {
      expect(sliceString(10, 100)(ALPHABET)).toEqual('klmnopqrstuvwxyz');
    });

    it('alphabet, >0 indexStart <len, <indexStart indexEnd >-len', () => {
      expect(sliceString(10, 5)(ALPHABET)).toEqual('');
    });

    it('alphabet, >0 indexStart <len, <indexStart indexEnd <-len', () => {
      expect(sliceString(10, -100)(ALPHABET)).toEqual('');
    });

    it('alphabet, >0 indexStart >len, >indexStart indexEnd >len', () => {
      expect(sliceString(100, 200)(ALPHABET)).toEqual('');
    });

    it('alphabet, >0 indexStart >len, <indexStart indexEnd >-len', () => {
      expect(sliceString(100, 5)(ALPHABET)).toEqual('');
    });

    it('alphabet, >0 indexStart >len, <indexStart indexEnd <-len', () => {
      expect(sliceString(100, -100)(ALPHABET)).toEqual('');
    });
  });
});
