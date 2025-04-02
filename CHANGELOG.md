# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][]

## [2.0.1][] - 2025-04-02

### Updated

- Improving internal types to remove `as` typescript usage

## [2.0.0][] - 2025-03-19

### Updated

- Improving `WizardStepperReducerState`, `Action`, `reducer` `initialState` and default values od `WizardStepperContext` types. All these types are now accepting generic values and the exposed methods can have their generic values applied.
- Better type safe: enforcing `useWizardContext` return to be `Readonly`
- Updating `setSteps` callback type to use the received generic type, if available.

### Added

- `<Step />` component can also have `id` as strings and numbers.

```tsx
...
const WizardSteps = () => (
  <Steps>
    <Step key="0" id="0">
      <div>
        <p>step 1</p>
      </div>
    </Step>
    {/* 🎉 For better DX, `<Step />` component can also have `id` as strings 🎉 */}
    <Step key="step2" id="step2">
      <div>
        <p>step 2</p>
      </div>
    </Step>
  </Steps>
);
```

## [1.1.0][] - 2023-02-13

### Updated

- Enabling react and react-dom dependencies greater than v17
- Adding `Readonly` advanced type on context values and methods

## [1.0.3][] - 2021-10-31

### Updated

- Improving code linting by adding `eslint-plugin-unicorn` package
- 🎉 Decreasing final bundle in 20% 🎉
- Updating code coverage for module
- Split `npm run lint` and `npm run lint:types` tasks to decrease pipeline time

### Fixed

- Distributing a single `.d.ts` type definition file. This will decrease the package install time.

### Removed

- Removed `es2020` and `es2015` bundles. This package is now distributing these bundle types
  - ESM: Using `esnext` modules
  - CJS: Using `CommonJS` modules
  - UMD: Using UMD

## [1.0.2][] - 2021-10-29

### Fixed

- Fixing types for `onNext` to cover the callback scenario

## [1.0.1][] - 2021-10-29

### Updated

- Improving build time by using `npm-run-all` package

### Added

- Adding `ES2020` bundle to be published
- Adding pre-commit hook

### Fixed

- Fixed link on `README.md` docs
- Fixed Types export in `package.json`

## [1.0.0][] - 2021-10-28

### Added

- Created `react-sweet-wizard` component
- Adding CircleCI pipeline for pull requests
- Adding stricter Eslint rules
- Adding stricter Typescript rules

### Updated

- Updating `README.md` docs
- Updating project dependencies

### Fixed

- Fixing unit tests

[unreleased]: https://github.com/willmendesneto/react-sweet-wizard/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/willmendesneto/react-sweet-wizard/tree/v1.0.0
[unreleased]: https://github.com/willmendesneto/react-sweet-wizard/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/willmendesneto/react-sweet-wizard/tree/v1.0.1
[unreleased]: https://github.com/willmendesneto/react-sweet-wizard/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/willmendesneto/react-sweet-wizard/tree/v1.0.2
[unreleased]: https://github.com/willmendesneto/react-sweet-wizard/compare/v1.0.3...HEAD
[1.0.3]: https://github.com/willmendesneto/react-sweet-wizard/tree/v1.0.3


[Unreleased]: https://github.com/willmendesneto/react-sweet-wizard/compare/v2.0.1...HEAD
[2.0.1]: https://github.com/willmendesneto/react-sweet-wizard/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/willmendesneto/react-sweet-wizard/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/willmendesneto/react-sweet-wizard/tree/v1.1.0
