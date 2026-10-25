<!-- docs-synced-at: 35f1fcc6b9ac -->

# Testing guide

**When to read:** before adding or changing tests, or when a gate fails and you need to know what it checks.

## Runners and commands

| Level | Runner | Command | Where tests live |
|---|---|---|---|
| Unit | Vitest 4 + Testing Library 16 (jsdom) | `npm run test` (`npm run test:coverage` with thresholds) | `src/**/*.test.ts?(x)` |

## What to test

- Behaviour through public interfaces, not implementation details.
- Every bug fix starts with a failing test that reproduces it.
- Unhappy paths for every external call: timeouts, malformed responses, auth failures.

## Fixtures and mocks

There are no fixture files. `src/index.test.tsx` builds small inline wizards with `WizardProvider`, `Steps` and `Step` and drives the hook with `renderHook`, `act` and `waitFor` from `@testing-library/react`, wrapping it in `WizardProvider`. Nothing is mocked: the library has no boundary to mock. Spies come from `vi.fn()` / `vi.spyOn()` and are restored in `afterEach` with `vi.restoreAllMocks()`. Tests that expect a render to throw go through the `expectRenderToThrow` helper, which silences `console.error` for that call only (React reports render errors there). The Testing Library DOM matchers are registered in `vitest.setup.ts`. Vitest is configured in `vitest.config.ts` with `globals: false`, so every test imports `describe`, `it`, `expect` and `vi` from `vitest`.

<!-- pack:testing -->

### Test runner

`vitest` runs unit tests with `npm run test`. There are no end-to-end tests.

### Rules that apply to every test

- A test must fail when the behaviour it covers is broken. Never wrap assertions in `if`; assert presence first, then act.
- Arrange, act, assert, in that order, with a blank line between them. One behaviour per test; name it after the behaviour, not the method.
- Mock only at the boundary (HTTP, time, randomness, environment). Do not mock the module under test or sibling components.
- Pin the clock when dates matter. Never assert on `Date.now()` output.
- Prefer table-free tests: duplicated `it` blocks with clear names beat a clever `each` that hides which case failed.
- Keep fixtures small and local to the test file unless three or more files share them.

<!-- /pack:testing -->

## Coverage and CI

Coverage comes from `@vitest/coverage-v8` over `src/**` (test files excluded) with global thresholds branches 91, functions 100, lines 96, statements 96 (`vitest.config.ts`). `npm run test:coverage` fails below any threshold; plain `npm run test` does not collect coverage. Reports land in `coverage/` as lcov, html and text-summary. In CI (`.github/workflows/ci.yml`), the `test` job runs `npm run test:coverage` on a matrix of Node 20, 22 and 24 by React 18 and 19 (the React version is installed with `npm install --no-save` after `npm ci`), and the Node 22 / React 19 leg uploads `coverage/lcov.info` to Coveralls; the badge in the README reads from it.

## Flaky or slow tests

None known. The suite is a single file with ten tests and runs in about a second. `onNext` awaits its callback, so tests that pass a callback wrap the call in `await act(async () => ...)` and assert with `waitFor` before reading `activeStepIndex`.

## Related documentation

- [DEVELOPMENT-STANDARDS.md](DEVELOPMENT-STANDARDS.md)
- [CODE-REVIEW-STANDARDS.md](CODE-REVIEW-STANDARDS.md)
