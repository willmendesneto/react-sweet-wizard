<!-- docs-synced-at: 35f1fcc6b9ac -->

# react-sweet-wizard public API

> **Current state:** Published as `react-sweet-wizard` 2.0.1 (2025-04-02). The library is eight small modules under `src/` behind the `src/index.ts` entry point, with no runtime dependencies and `react`/`react-dom` `>=18.0.0` as peers. State is in-memory React reducer state only. 2.0.0 added generics and string ids; 2.0.1 removed TypeScript `as` casts. Stable, small, fully covered by `src/index.test.tsx`.

## When to read this doc

- You change anything exported from `src/index.ts`: `WizardProvider`, `Steps`, `Step`, `useWizardContext`, `DefaultWizardStepProps` or `WizardContextValue`.
- You change the reducer, its actions or the meaning of `goTo`, `onNext`, `onPrevious` or `setSteps`.
- You change the error messages thrown for misuse; consumers and tests assert on them.
- You touch build outputs, `peerDependencies` or the size budgets.

## Public API

| Export | Kind | Signature | Notes |
|---|---|---|---|
| `DefaultWizardStepProps` | type | `interface DefaultWizardStepProps { id: number \| string }` | Base shape of a step. Extend it for custom step data and pass the result as the generic to `useWizardContext<T>()`. |
| `WizardProvider` | component | `WizardProvider<T extends DefaultWizardStepProps>({ children }: { children: ReactNode }): JSX.Element` | Owns the state `{ activeStepIndex: 0, steps: [] }` and provides a memoised context. Required above `Steps` and every `useWizardContext` call. |
| `Steps` | component | `Steps({ children }: { children: JSX.Element \| JSX.Element[] }): JSX.Element` | Accepts only `Step` elements as direct children and at least one. Registers `{ id }` per child through `setSteps` when the count changes, then renders the active child only. |
| `Step` | component | `Step({ id, children }: { id: number \| string; children: ReactNode }): ReactElement` | Renders `<div id={String(id)}>{children}</div>`. The id is registered with its original type (`0` stays a number, `'b'` a string). |
| `useWizardContext` | hook | `useWizardContext<T extends DefaultWizardStepProps = DefaultWizardStepProps>(): Readonly<WizardStepperContextProps<T>>` | Throws outside a `WizardProvider`. Returns `activeStepIndex`, `steps`, `isFirstStep`, `isLastStep`, `goTo`, `onNext`, `onPrevious`, `getActiveStep`, `setSteps`. The return type is exported as `WizardContextValue<T>`. |
| `WizardContextValue` | type | `interface WizardContextValue<T = DefaultWizardStepProps> { activeStepIndex; steps; isFirstStep; isLastStep; goTo; onNext; getActiveStep; onPrevious; setSteps }` | The object `useWizardContext<T>()` returns; use it to type props or helpers that receive the wizard context. |

## Options and defaults

`WizardProvider` and `Steps` take no props besides `children`. `Step` takes `id` (`number | string`) and `children`. `useWizardContext<T>()` takes one generic, `T extends DefaultWizardStepProps`, defaulting to `DefaultWizardStepProps` (`{ id: number | string }`); `steps`, `setSteps` and `getActiveStep` are typed with `T`.

The hook returns:

| Member | Type | Default or behaviour |
|---|---|---|
| `activeStepIndex` | `number` | `0` |
| `steps` | `T[]` | `[]` until `Steps` registers its children or you call `setSteps` |
| `isFirstStep` | `boolean` | `activeStepIndex === 0` |
| `isLastStep` | `boolean` | `steps.length > 0 && activeStepIndex >= steps.length - 1`, so `false` while `steps` is empty |
| `onNext(cb?)` | `(cb?: () => void \| Promise<void>) => Promise<void>` | Awaits `cb` if given, then moves forward one step and resolves; a rejecting `cb` keeps the step and the promise rejects with the same error; no-op on the last step |
| `onPrevious()` | `() => void` | Moves back one step; no-op on the first step |
| `goTo(idOrIndex)` | `(id: number \| string) => void` | A number is an **index**, a string is matched against `step.id`; ignored when out of range or already active |
| `getActiveStep()` | `() => T` | `steps[activeStepIndex]`; `undefined` while `steps` is empty |
| `setSteps(steps)` | `(steps: T[]) => void` | Replaces the registered steps; use it to attach data to each step |

## Behaviour and edge cases

- **Fail fast on misuse.** `useWizardContext` throws `Please make sure you're wrapping all the steps in a 'WizardProvider' component` without a provider. `Steps` throws `Steps should have at least a single child component` with no valid children and `Error at position "<i>". You should compose Steps using "Step" component` when a child is not a `Step`. Wrapping `Step` in your own component therefore breaks `Steps`; compose inside the `Step` instead.
- **Navigation never throws.** Out-of-range `onNext`, `onPrevious` and `goTo` are ignored by the reducer. The ten tests in `src/index.test.tsx` cover these cases.
- **`goTo` semantics (unchanged in 3.0 by decision).** A number is an index: `goTo(1)` goes to the second step regardless of ids. A string is matched against `step.id`: `goTo('step3')`. A numeric id is therefore never matched by `goTo`; address that step by its index.
- **`onNext` returns a Promise.** The optional callback (sync or async) is awaited before `NEXT_PAGE` is dispatched, so a validator that throws or rejects keeps the wizard on the current step and the returned promise rejects with the same error; `await onNext(validate)` resolves only after the step advanced. Handle or `catch` the promise at the call site. In tests wrap the call in `await act(async () => ...)`.
- **Step registration is count-based.** `Steps` calls `setSteps` only when `steps.length !== children.length`. Changing a child's `id` without changing the count does not re-register; neither does `setSteps` with the same length followed by a child change. Data attached through `setSteps` is kept until the count changes.
- **First render.** `steps` is `[]` until the registration effect runs, so `isFirstStep` is `true`, `isLastStep` is `false` and `getActiveStep()` is `undefined` for that render.
- **`Step` ids.** `Step`, `DefaultWizardStepProps.id` and `goTo` all accept `number | string` (since 3.0; 2.x typed the `Step` prop as `string`). The DOM `id` attribute is the stringified value; the registered step keeps the original type, so `goTo(0)` is an index while `getActiveStep().id` may be the number `0`.
- **Rendering.** `Steps` returns exactly one child (`children[activeStepIndex]`), and `Step` wraps content in a `div` whose DOM `id` is the step id. There are no styles, no transitions and no focus management.

## Server-side rendering

The library does not read `window`, `document` or any browser API, so `renderToString` of a wizard should work and will render the first step. This is not tested: there is no `test:ssr` script and no SSR test. Treat SSR support as unverified until one exists.

## Bundle and compatibility

- Formats: ESM (`dist/esm/index.js`, `exports.import`), CommonJS (`dist/cjs/index.cjs`, ES2019, `exports.require`), declarations (`dist/types/index.d.ts`, `exports.types`). `sideEffects: false`. Only the package root is exported; deep imports of `dist/*` are not supported. No UMD build since 3.0.
- Peer dependencies: `react >=18.0.0`, `react-dom >=18.0.0` (CI tests React 18 and 19); no runtime dependencies
- Size budget: `size-limit` (`.size-limit.json`, gzip): ESM 1228 B, CJS 1331 B. Run `npm run build && npm run size`.

## Testing

| Area | Where |
|---|---|
| integration through the entry point (provider, hook, Steps/Step) | `src/index.test.tsx` |
| reducer transitions (pure) | `src/reducer.test.ts` |
| coverage thresholds | `vitest.config.ts` |

## Key source files

- `src/index.ts` (entry point)
- `src/types.ts`
- `src/reducer.ts` and `src/reducer.test.ts`
- `src/WizardProvider.tsx`, `src/Steps.tsx`, `src/Step.tsx`, `src/useWizardContext.ts`, `src/context.ts`
- `src/index.test.tsx` (integration suite through the entry point)
- `package.json`
- `rollup.config.js`
- `tsconfig.build.json`
- `vitest.config.ts`

## Related documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [TESTING-GUIDE.md](../TESTING-GUIDE.md)
- [playbooks/RELEASE-WORKFLOW.md](../playbooks/RELEASE-WORKFLOW.md)
- [README.md (consumer-facing usage)](../../README.md)

