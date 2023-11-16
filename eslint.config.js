import { vinicuncaESLint } from '@vinicunca/eslint-config';

export default vinicuncaESLint({
  userConfigs: [
    {
      rules: {
        'function-paren-newline': ['error', 'consistent'],
        'ts/no-namespace': 'off',
      },
    },
  ],
});
