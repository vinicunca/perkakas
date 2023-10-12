import { vinicuncaESLint } from '@vinicunca/eslint-config';

export default vinicuncaESLint({
  userConfigs: [
    {
      rules: {
        'ts/no-namespace': 'off',
      },
    },
  ],
});
