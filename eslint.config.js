// ESLint flat config. `npm run lint` lints `src/`; test files get the Jest and Testing Library rules.
const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const testingLibrary = require('eslint-plugin-testing-library');
const jest = require('eslint-plugin-jest');
const prettier = require('eslint-plugin-prettier/recommended');

const testFiles = ['src/**/*.test.{ts,tsx}'];

module.exports = tseslint.config(
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**', '.jest/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    settings: { react: { version: 'detect' } },
    rules: {
      'no-console': 'error',
      'react/prop-types': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  { files: testFiles, ...jest.configs['flat/recommended'] },
  { files: testFiles, ...testingLibrary.configs['flat/react'] },
  {
    files: testFiles,
    languageOptions: { globals: { ...globals.jest } },
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
  prettier
);
