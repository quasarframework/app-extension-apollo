const { resolve } = require('path')

module.exports = {
  root: true,

  extends: [
    'eslint:recommended',
    'plugin:lodash-template/recommended-with-script'
  ],

  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },

  env: {
    browser: true,
  },

  globals: {
    process: 'readonly',
  },

  settings: {
    'lodash-template/globals': [
      'hasVite',
      'hasSubscriptions',
      'subscriptionsTransport'
    ]
  },

  overrides: [
    // TODO: Investigate why linting doesn't work properly when there is at least one template branching inside a file (e.g. <% if (hasVite) { %>).
    {
      files: ['./typescript/**/*.ts'],

      // typescript-eslint overrides the parser, so we need to set it back
      parser: 'eslint-plugin-lodash-template/lib/parser/micro-template-eslint-parser.js',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
      },

      extends: [
        'plugin:@typescript-eslint/recommended',

        // This requires parserOptions.project to be set to a path to tsconfig.json.
        // But, eslint-plugin-lodash-template will generate virtual files which can't be specified in tsconfig.json,
        // and TypeScript doesn't seem to be able to handle that with glob patterns.
        // So, we can't use it for now. TODO: https://github.com/ota-meshi/eslint-plugin-lodash-template/issues/new
        // 'plugin:@typescript-eslint/recommended-requiring-type-checking'
      ],
    }
  ]
}
