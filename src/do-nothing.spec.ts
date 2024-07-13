import { doNothing } from './do-nothing';

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
