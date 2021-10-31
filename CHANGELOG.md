# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][]

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


[Unreleased]: https://github.com/willmendesneto/react-sweet-wizard/compare/v1.0.3...HEAD
[1.0.3]: https://github.com/willmendesneto/react-sweet-wizard/tree/v1.0.3