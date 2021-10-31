/* eslint-disable @typescript-eslint/no-var-requires */
const { readdirSync, statSync } = require('fs');
const { join } = require('path');
const { dependencies, devDependencies } = require('./package.json');

const SRC_PATH = `${__dirname}/src`;
const SRC_FOLDERS = readdirSync(SRC_PATH)
  .map(file => join(SRC_PATH, file))
  .filter(path => statSync(path).isDirectory())
  .map(file => file.replace(`${SRC_PATH}/`, ''))
  .sort();

module.exports = {
  settings: {
    react: {
      pragma: 'React',
      // eslint-disable-next-line import/no-internal-modules
      version: require('./node_modules/react/package.json').version,
    },
    jest: {
      // eslint-disable-next-line import/no-internal-modules
      version: require('./node_modules/jest/package.json').version,
    },
  },
  plugins: [
    '@typescript-eslint',
    'sonarjs',
    'jsx-a11y',
    'testing-library',
    'jest-dom',
    'jest',
    'import',
    'react',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
    'plugin:jest/recommended',
    'plugin:sonarjs/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  env: {
    es6: true,
    browser: true,
    node: true,
    'jest/globals': true,
  },
  rules: {
    'prettier/prettier': 'error',
    'prefer-template': 'error',
    'react/prop-types': 'off',
    'import/no-anonymous-default-export': 'off',
    'jest/no-identical-title': 'warn',
    'jest/no-conditional-expect': 'warn',
    'jest/valid-expect': 'off',
    'sonarjs/no-duplicate-string': 'off',
    'sonarjs/no-identical-functions': 'off',
    'sonarjs/cognitive-complexity': ['error', 60],
    'no-console': 'warn',
    'require-await': 'error',
    // let typescript compiler handle unused vars
    'no-unused-vars': 'off',
    'no-extra-semi': 'off',
    'no-duplicate-imports': ['error', { includeExports: false }],
    'prefer-const': ['error', { destructuring: 'all' }],
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    'jsx-a11y/no-autofocus': [2, { ignoreNonDOM: true }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        peerDependencies: true,
        devDependencies: [
          '!src/setupTests.ts',
          '!**/*test-utils.tsx',
          '!**/*.story.{js,ts,tsx}',
          '!**/*.test.{js,ts,tsx}',
          '!**/*.spec.{js,ts,tsx}',
        ],
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: ['..*'],
        paths: [
          {
            name: 'react-router',
            message:
              "Please import e.g. import {yourFunction} from 'react-router-dom' instead.",
          },
        ],
      },
    ],
    'arrow-body-style': ['error', 'as-needed'],
    curly: 'error',
    eqeqeq: ['error', 'always'],
    'no-debugger': 'error',
    'no-useless-concat': 'error',
    'no-implicit-globals': 'error',
    'no-dupe-keys': 'error',
    'import/named': 'error',
    'import/no-cycle': 'error',
    'import/no-duplicates': 'error',
    'prefer-object-spread': 'error',
    'no-new-wrappers': 'error',
    'no-unused-expressions': 'error',
    'import/no-default-export': 'error',
    'import/no-internal-modules': [
      'error',
      {
        allow: [
          'react-icons/*',
          '@testing-library/jest-dom/*',
          'react-query/devtools',
          'ts-jest/utils',
        ],
      },
    ],
    'no-restricted-properties': [
      2,
      {
        object: 'Object',
        property: 'create',
        message:
          'Please use Object destructuring instead. E.G. `const data = {...defaultValues, newValue: true }`',
      },
      {
        object: 'Object',
        property: 'assign',
        message:
          'Please use Object destructuring instead. E.G. `const data = {...defaultValues, newValue: true }`',
      },
    ],
    'no-mixed-operators': 'error',
    'padded-blocks': ['error', 'never'],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'index',
          'sibling',
          'parent',
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@**/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'react-*',
            group: 'external',
            position: 'before',
          },
        ]
          .concat(
            // Adding order for dependencies and dev dependencies
            // across codebase
            []
              .concat(Object.keys(dependencies), Object.keys(devDependencies))
              .filter(pkg => !['@', 'react'].includes(pkg))
              .sort()
              .map(pkg => ({
                pattern: pkg,
                group: 'external',
                position: 'before',
              }))
          )
          .concat(
            // Internal folders order E.G. `components/*` as an alias of `src/components/*`
            // should be added before `pages/*` as an alias of `src/pages/*`
            SRC_FOLDERS.map(folder => ({
              pattern: `${folder}/*`,
              group: 'internal',
              position: 'before',
            }))
          ),
        pathGroupsExcludedImportTypes: ['react'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'never',
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        jsxPragma: null,
        // typescript-eslint specific options
        warnOnUnsupportedTypeScriptVersion: true,
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      rules: {
        // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
        'default-case': 'off',
        // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
        'no-dupe-class-members': 'off',
        // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
        'no-undef': 'off',

        // Add TypeScript specific rules (and turn off ESLint equivalents)
        '@typescript-eslint/consistent-type-assertions': 'warn',
        'no-array-constructor': 'off',
        '@typescript-eslint/no-array-constructor': 'warn',
        'no-redeclare': 'off',
        // '@typescript-eslint/no-redeclare': 'warn',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': [
          'warn',
          {
            functions: false,
            classes: false,
            variables: false,
            typedefs: false,
          },
        ],
        'no-case-declarations': 'off',
        'react/react-in-jsx-scope': 'error',
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        'react/jsx-filename-extension': [
          1,
          { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        ],
        'react/jsx-no-undef': ['error', { allowGlobals: true }],
        'import/no-unresolved': [2, { caseSensitiveStrict: true }],
        'no-unused-vars': 'off',
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-extra-semi': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_', args: 'all' },
        ],
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        // Justification: Forgetting to await a promise is a common mistake
        '@typescript-eslint/no-floating-promises': [
          'error',
          { ignoreVoid: true, ignoreIIFE: true },
        ],
        '@typescript-eslint/no-misused-promises': [
          'error',
          { checksVoidReturn: false },
        ],
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              '{}': {
                message: 'Use `Record<string, never>` instead',
                fixWith: 'Record<string, never>',
              },
            },
          },
        ],
        // We are letting Typescript handle no-unused expressions instead in this case
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 'error',
      },
    },
    {
      files: [
        // Test files
        '**/__*__/**',
        '**/*.test.*',
      ],
      rules: {
        '@typescript-eslint/no-floating-promises': 'off',
      },
    },
    {
      // Enabling eslint-plugin-testing-library rules only for test files
      files: ['**/?(*.)+(test).[jt]s?(x)'],
      extends: [
        'plugin:testing-library/react',
        'plugin:jest-dom/recommended',
        'plugin:jest/all',
        'plugin:unicorn/all',
      ],
      rules: {
        'unicorn/new-for-builtins': 'off',
        'unicorn/filename-case': [
          'error',
          {
            case: 'camelCase',
          },
        ],
        'unicorn/prevent-abbreviations': [
          'error',
          {
            allowList: {
              props: true,
              getInitialProps: true,
            },
          },
        ],
        'testing-library/no-node-access': 'off',
        'testing-library/prefer-find-by': 'off',
        'jest/prefer-expect-assertions': 'off',
        'jest/no-hooks': 'off',
        'jest/prefer-strict-equal': 'off',
        'jest-dom/prefer-to-have-value': 'off',
        'jest/prefer-lowercase-title': [
          'error',
          {
            ignore: ['describe'],
          },
        ],
      },
    },
  ],
};
