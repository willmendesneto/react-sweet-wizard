// ESLint flat config. `npm run lint` lints the whole repo: src/ with the React rules, test files with
// the Vitest and Testing Library rules, configs and scripts with Node globals.
const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const testingLibrary = require('eslint-plugin-testing-library');
const vitest = require('@vitest/eslint-plugin');
const prettier = require('eslint-plugin-prettier/recommended');

const testFiles = ['src/**/*.test.{ts,tsx}'];

module.exports = tseslint.config(
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**', '.claude/**'] },
  { settings: { react: { version: 'detect' } } },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      'no-console': 'error',
      'react/prop-types': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['*.{js,mjs,ts}', 'scripts/**/*.mjs'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['eslint.config.js'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  { files: testFiles, ...vitest.configs.recommended },
  { files: testFiles, ...testingLibrary.configs['flat/react'] },
  {
    files: testFiles,
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'vitest/expect-expect': [
        'error',
        { assertFunctionNames: ['expect', 'expectRenderToThrow'] },
      ],
    },
  },
  prettier
);
