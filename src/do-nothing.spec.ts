import { doNothing } from './do-nothing';

describe('runtime', () => {
  it('works', () => {
    const doesNothing = doNothing();
    doesNothing();
  });

  it('works with more than one argument', () => {
    const doesNothing = doNothing();
    doesNothing(1);
    doesNothing(1, 2);
    doesNothing(1, 2, 'a');
    doesNothing(undefined);
    doesNothing(['a']);
  });
});

describe('typing', () => {
  it('supported in any api', () => {
    mockApi({
      onMixOfParams: doNothing(),
      onNoParams: doNothing(),
      onVariadicParams: doNothing(),
    });
  });
});

function mockApi(_options: {
  readonly onMixOfParams: (result: string, isOptionalBoolean?: true) => void;
  readonly onNoParams: () => void;
  readonly onVariadicParams: (...args: ReadonlyArray<string>) => void;
}): void {
  /* do nothing */
}
