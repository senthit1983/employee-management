module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'prettier',
    ],
    plugins: [
      '@typescript-eslint',
    ],
    env: {
      node: true,
      jest: true,
    },
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: false,
      },
    },
    rules: {
      // Customize your rules here
    },
    globals: {
      test: true,
      expect: true,
    },
  };
  