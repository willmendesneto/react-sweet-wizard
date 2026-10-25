<!-- docs-synced-at: 35f1fcc6b9ac -->

# react-sweet-wizard public API

> **Current state:** 3.0.0 in development on the `revamp` branch (last published: 2.0.1, 2025-04-02). The library is eight small modules under `src/` behind the `src/index.ts` entry point, with no runtime dependencies and `react >=18.0.0` as its only peer. State is in-memory React reducer state only. Covered at 100% by five test files (`src/*.test.ts(x)`).

## When to read this doc

- You change anything exported from `src/index.ts`: `WizardProvider`, `Steps`, `Step`, `useWizardContext`, `DefaultWizardStepProps` or `WizardContextValue`.
- You change the reducer, its actions or the meaning of `goTo`, `onNext`, `onPrevious` or `setSteps`.
- You change the error messages thrown for misuse; consumers and tests assert on them.
- You touch build outputs, `peerDependencies` or the size budgets.

## Public API

| Export | Kind | Signature | Notes |
|---|---|---|---|
| `DefaultWizardStepProps` | type | `interface DefaultWizardStepProps { id: number \| string }` | Base shape of a step. Extend it for custom step data and pass the result as the generic to `useWizardContext<T>()`. |
| `WizardProvider` | component | `WizardProvider<T extends DefaultWizardStepProps>({ children }: { children: ReactNode }): ReactElement` | Owns the state `{ activeStepIndex: 0, steps: [] }` and provides a memoised context. Required above `Steps` and every `useWizardContext` call. |
| `Steps` | component | `Steps({ children }: { children: ReactElement \| ReactElement[] }): ReactElement \| null` | Accepts only `Step` elements as direct children and at least one. Registers one `{ id }` per child whenever the children's ids differ from the registered ids, then renders the active child only. |
| `Step` | component | `Step({ id, children }: { id: number \| string; children: ReactNode }): ReactElement` | Renders `<div id={String(id)}>{children}</div>`. The id is registered with its original type (`0` stays a number, `'b'` a string). |
| `useWizardContext` | hook | `useWizardContext<T extends DefaultWizardStepProps>(): Readonly<WizardContextValue<T>>` | Throws outside a `WizardProvider`. `T` is inferred as `DefaultWizardStepProps` when omitted. |
| `WizardContextValue` | type | `interface WizardContextValue<T = DefaultWizardStepProps> { activeStepIndex; steps; isFirstStep; isLastStep; goTo; onNext; getActiveStep; onPrevious; setSteps }` | The object `useWizardContext<T>()` returns; use it to type props or helpers that receive the wizard context. |

## Options and defaults

`WizardProvider` and `Steps` take no props besides `children`. `Step` takes `id` (`number | string`) and `children`. `useWizardContext<T>()` takes one generic, `T extends DefaultWizardStepProps`; `steps`, `setSteps` and `getActiveStep` are typed with `T`.

The hook returns:

| Member | Type | Default or behaviour |
|---|---|---|
| `activeStepIndex` | `number` | `0`; clamped to the last step when steps are removed |
| `steps` | `T[]` | `[]` until `Steps` registers its children or you call `setSteps` |
| `isFirstStep` | `boolean` | `activeStepIndex === 0` |
| `isLastStep` | `boolean` | `steps.length > 0 && activeStepIndex >= steps.length - 1`, so `false` while `steps` is empty |
| `onNext(cb?)` | `(cb?: () => void \| Promise<void>) => Promise<void>` | Awaits `cb` if given, then moves forward one step and resolves; a rejecting `cb` keeps the step and the promise rejects with the same error; no-op on the last step |
| `onPrevious()` | `() => void` | Moves back one step; no-op on the first step |
| `goTo(indexOrId)` | `(id: number \| string) => void` | A number is an **index**; a string is matched against `String(step.id)`; ignored when out of range or already active |
| `getActiveStep()` | `() => T \| undefined` | `steps[activeStepIndex]`; `undefined` while `steps` is empty |
| `setSteps(steps)` | `(steps: T[]) => void` | Replaces the registered steps (the index is clamped); use it to attach data to each step |

## Behaviour and edge cases

- **Fail fast on misuse.** Hooks run before validation, so the checks below never make `Steps` call hooks conditionally. `useWizardContext` throws `Please make sure you're wrapping all the steps in a 'WizardProvider' component` without a provider. `Steps` throws `Steps should have at least a single child component` with no valid children and `Error at position "<i>". You should compose Steps using "Step" component` when a child is not a `Step`. Wrapping `Step` in your own component therefore breaks `Steps`; compose inside the `Step` instead.
- **Navigation never throws.** Out-of-range `onNext`, `onPrevious` and `goTo` are ignored by the reducer (`src/reducer.test.ts`, `src/index.test.tsx`).
- **`goTo` semantics (unchanged in 3.0 by decision).** A number is an index: `goTo(1)` goes to the second step regardless of ids. A string is matched against the step id as a string: `goTo('step3')`, and `goTo('10')` finds `<Step id={10}>`. A numeric argument is never matched against ids; pass the id as a string to address a step with a numeric id.
- **`onNext` returns a Promise.** The optional callback (sync or async) is awaited before `NEXT_PAGE` is dispatched, so a validator that throws or rejects keeps the wizard on the current step and the returned promise rejects with the same error; `await onNext(validate)` resolves only after the step advanced. Handle or `catch` the promise at the call site. In tests wrap the call in `await act(async () => ...)`.
- **Step registration follows the ids.** On mount and whenever its children's ids change, `Steps` sends them to the reducer through an internal action. The reducer compares them with the latest registered steps (as strings, so `0` and `'0'` match): when they match it keeps the current steps untouched, so data you attached through `setSteps` survives whether your component renders before, after or inside `Steps`; otherwise it registers fresh `{ id }` objects. Steps registered this way carry only `id`: declare extra fields of `T` optional, or call `setSteps` before reading them. Use one `Steps` per `WizardProvider`; with several, the one whose ids changed last defines `steps`.
- **Removing steps.** When the steps shrink below the active index (a child removed, or a shorter `setSteps`), `activeStepIndex` moves to the new last step instead of leaving the wizard blank.
- **First render.** `steps` is `[]` until the registration effect runs, so `isFirstStep` is `true`, `isLastStep` is `false` and `getActiveStep()` is `undefined` for that render.
- **`Step` ids.** `Step`, `DefaultWizardStepProps.id` and `goTo` all accept `number | string` (since 3.0; 2.x typed the `Step` prop as `string`). The DOM `id` attribute is the stringified value; the registered step keeps the original type, so `getActiveStep()?.id` may be the number `0`.
- **Rendering.** `Steps` returns exactly one child (`children[activeStepIndex]`, or `null` before registration catches up), and `Step` wraps content in a `div` whose DOM `id` is the step id. There are no styles, no transitions and no focus management.

## Server-side rendering

The library does not read `window`, `document` or any browser API, so `renderToString` of a wizard should work and will render the first step. This is not tested: there is no `test:ssr` script and no SSR test. Treat SSR support as unverified until one exists.

## Bundle and compatibility

- Formats: ESM `dist/esm/index.mjs` with `dist/esm/index.d.mts` (`exports["."].import`), CommonJS `dist/cjs/index.cjs` (ES2019) with `dist/cjs/index.d.cts` (`exports["."].require`, `main`, `types`). `"type": "commonjs"`, `sideEffects: false`. Only the package root and `./package.json` are exported; deep imports of `dist/*` are not supported. No UMD build since 3.0. `npm run lint:package` (publint and attw) checks node16 and bundler resolution.
- Peer dependency: `react >=18.0.0` (CI tests React 18 and 19); no runtime dependencies.
- Node: `engines.node >=22`.
- Size budget: `size-limit` (`.size-limit.json`, gzip): 1500 B each for ESM and CJS (about 1.45 KB today). Run `npm run build && npm run size`.

## Testing

| Area | Where |
|---|---|
| integration through the entry point (provider, hook, Steps/Step) | `src/index.test.tsx` |
| reducer transitions (pure) | `src/reducer.test.ts` |
| `Steps` registration, consumer ordering, removal, errors | `src/Steps.test.tsx` |
| `Step` ids | `src/Step.test.tsx` |
| hook flags and `onNext` promise | `src/useWizardContext.test.tsx` |
| coverage thresholds | `vitest.config.ts` |
| package entry points (import and require) | `scripts/check-package.mjs`, `npm run lint:package` |

## Key source files

- `src/index.ts` (entry point)
- `src/types.ts`
- `src/reducer.ts`
- `src/WizardProvider.tsx`, `src/Steps.tsx`, `src/Step.tsx`, `src/useWizardContext.ts`, `src/context.ts`
- `package.json`
- `rollup.config.mjs`
- `tsconfig.build.json`
- `vitest.config.ts`

## Related documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [TESTING-GUIDE.md](../TESTING-GUIDE.md)
- [playbooks/RELEASE-WORKFLOW.md](../playbooks/RELEASE-WORKFLOW.md)
- [README.md (consumer-facing usage)](../../README.md)
