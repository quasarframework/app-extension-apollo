const { resolve } = require('path')

module.exports = {
  root: true,

  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018,
    sourceType: 'module',
  },

  env: {
    browser: true,
  },

  extends: ['eslint:recommended', 'prettier'],

  rules: {
    quotes: ['warn', 'single', { avoidEscape: true }],
  },

  overrides: [
    {
      files: ['**/*.ts'],
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
      ],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
}
