<!-- docs-synced-at: 35f1fcc6b9ac -->

# Testing guide

**When to read:** before adding or changing tests, or when a gate fails and you need to know what it checks.

## Runners and commands

| Level | Runner | Command | Where tests live |
|---|---|---|---|
| Unit | Jest 27 + Testing Library (jsdom) | `npm run test` | `src/**/*.test.tsx` |

## What to test

- Behaviour through public interfaces, not implementation details.
- Every bug fix starts with a failing test that reproduces it.
- Unhappy paths for every external call: timeouts, malformed responses, auth failures.

## Fixtures and mocks

There are no fixture files. `src/index.test.tsx` builds small inline wizards with `WizardProvider`, `Steps` and `Step`, renders them with `@testing-library/react` and drives the hook with `renderHook` from `@testing-library/react-hooks`, wrapping it in `WizardProvider`. Nothing is mocked: the library has no boundary to mock. `clearMocks` and `resetMocks` are on in `jest.config.js`, so any `jest.fn()` you add is reset between tests. `@testing-library/jest-dom` matchers are loaded from `jest.setup.js`.

<!-- pack:testing -->

### Test runner

`jest` runs unit tests with `npm run test`. There are no end-to-end tests.

### Rules that apply to every test

- A test must fail when the behaviour it covers is broken. Never wrap assertions in `if`; assert presence first, then act.
- Arrange, act, assert, in that order, with a blank line between them. One behaviour per test; name it after the behaviour, not the method.
- Mock only at the boundary (HTTP, time, randomness, environment). Do not mock the module under test or sibling components.
- Pin the clock when dates matter. Never assert on `Date.now()` output.
- Prefer table-free tests: duplicated `it` blocks with clear names beat a clever `each` that hides which case failed.
- Keep fixtures small and local to the test file unless three or more files share them.

<!-- /pack:testing -->

## Coverage and CI

Coverage is always collected (`collectCoverage: true`, `collectCoverageFrom: ['**/src/*.{ts,tsx}']`) and the global thresholds are branches 91, functions 100, lines 96, statements 96. A drop below any threshold fails `npm run test`. Reports land in `coverage/` as lcov, html and text-summary. In CI, `npm run test:ci` pipes lcov to Coveralls; the badge in the README reads from it.

## Flaky or slow tests

None known. The suite is a single file with ten tests and runs in a few seconds. `onNext` awaits its callback, so tests that pass a callback must `await act(...)` before asserting on `activeStepIndex`.

## Related documentation

- [DEVELOPMENT-STANDARDS.md](DEVELOPMENT-STANDARDS.md)
- [CODE-REVIEW-STANDARDS.md](CODE-REVIEW-STANDARDS.md)
