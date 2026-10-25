<!-- docs-synced-at: 35f1fcc6b9ac -->

# Architecture

**When to read:** before adding a module, changing a boundary between modules, or touching how data
flows in and out of the system.

## What this project is

`react-sweet-wizard` is a zero-dependency React library for building multi-step (wizard) flows. A `WizardProvider` holds the wizard state in a `useReducer`-backed context, `Steps` and `Step` render only the active step, and the `useWizardContext` hook exposes navigation (`onNext`, `onPrevious`, `goTo`), step data (`steps`, `setSteps`, `getActiveStep`) and position flags (`isFirstStep`, `isLastStep`). The hook is generic over a consumer-defined step shape that extends `DefaultWizardStepProps`. It is headless: it ships no styles and no UI beyond a wrapping `div` per step, so it composes with any design system.

Kind: lib. Stack: TypeScript 5.9 (strict) and React, built with Rollup 4 (ESM and CommonJS with declarations); tested with Vitest 4, Testing Library 16 and jsdom; linted with ESLint and Prettier; size-checked with `size-limit`; CI on GitHub Actions.

## Modules

| Module | Responsibility | Entry points | Doc |
|---|---|---|---|
| `src/index.tsx` | Whole library: provider, reducer, `Steps`/`Step` components and the `useWizardContext` hook | `src/index.tsx` | [api/REACT-SWEET-WIZARD.md](api/REACT-SWEET-WIZARD.md) |

## Boundaries

The whole library lives in one file, `src/index.tsx`, and everything a consumer can use is exported from it. Internal pieces stay unexported on purpose: the reducer, its `Action` union, `WizardStepperReducerState`, the `WizardStepperContext` object and the `WizardStepperContextProps` interface. Consumers type the context through `useWizardContext<T>()` inference only. The library never fetches, never touches `window`, `document`, storage or the URL, and holds no global state; all state is in-memory React state owned by the nearest `WizardProvider`. Keep it that way: new behaviour belongs inside the provider or hook and is exposed through the hook's small, documented API.

## Data flow

1. `WizardProvider` creates reducer state `{ activeStepIndex: 0, steps: [] }` and memoises a context value with the navigation callbacks and derived flags.
2. `Steps` validates its children (at least one, all of type `Step`), reads the context, and in a `useEffect` calls `setSteps` with `{ id }` objects taken from each child's `id` prop whenever the registered step count differs from the child count. It renders `children[activeStepIndex]`.
3. Consumers call `onNext(cb?)`, `onPrevious()`, `goTo(idOrIndex)` or `setSteps(steps)` from `useWizardContext()`. Each dispatches one action: `NEXT_PAGE` and `PREV_PAGE` are clamped to the step bounds; `GOTO_PAGE` treats a number as an **index** and a string as a step `id`, and is ignored when out of range or already active; `SET_STEP_COUNT` replaces the `steps` array.
4. `onNext` awaits its optional callback before dispatching, so a rejected callback leaves the wizard on the current step.

## External dependencies and integrations

- Peer dependencies: `react` and `react-dom` at `>=18.0.0` (CI runs the tests on React 18 and 19). No runtime dependencies (`dependencies` is empty and `sideEffects` is `false`).
- Build: one Rollup 4 run (`rollup.config.mjs`, `@rollup/plugin-typescript`) emits `dist/esm/index.js`, `dist/cjs/index.cjs` (ES2019) and `dist/types/index.d.ts`, all with source maps. `react` and `react/jsx-runtime` are externals. There is no UMD build since 3.0. `scripts/check-package.mjs` verifies the tarball against `package.json` after each build.
- CI: GitHub Actions (`.github/workflows/ci.yml`) runs five jobs on every push and pull request to `main`: `lint`, `types`, `test` (coverage, Node 20/22/24, Coveralls upload from the Node 22 leg), `build` with `scripts/check-package.mjs` (Node 20/22/24) and `size`. Dependabot (`.github/dependabot.yml`) opens weekly grouped PRs for dev dependencies and actions.
- Local hooks: Husky `pre-commit` runs `lint-staged`, which runs Prettier on staged `js/ts/jsx/tsx` files.

## Build and runtime

- Build: `npm run build`
- Output: `dist/esm/index.js` (`exports.import`, `module`), `dist/cjs/index.cjs` (`exports.require`, `main`), `dist/types/index.d.ts` (`exports.types`, `types`). `npm run build` removes `dist/` first.

## Known constraints and debt

- Size budgets are tight and enforced in CI (`.size-limit.json`, gzip): ESM 1228 B, CJS 1331 B. Almost any new import or branch needs a budget review.
- Vitest coverage thresholds (branches 91, functions 100, lines 96, statements 96) fail `npm run test:coverage` when coverage drops; CI runs that script.
- `Step`'s `id` prop is typed `string` although the reducer, README and 2.0.0 changelog accept numbers too. Widening the type is a non-breaking fix still to do.
- `goTo(number)` means index, `goTo(string)` means id. Changing this would be breaking.
- Step registration is count-based: changing a child's `id` without changing the number of children does not update the registered steps.
- On the first render `steps` is `[]`, so `isLastStep` is `true` until the registration effect runs.
- SSR safety is plausible (no DOM access) but untested; there is no `test:ssr` script.

## Related documentation

- [DEVELOPMENT-STANDARDS.md](DEVELOPMENT-STANDARDS.md)
- [TESTING-GUIDE.md](TESTING-GUIDE.md)
- [decisions/](decisions/README.md)
