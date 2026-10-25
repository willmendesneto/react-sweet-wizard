<!-- docs-synced-at: 35f1fcc6b9ac -->

# react-sweet-wizard public API

> **Current state:** Published as `react-sweet-wizard` 2.0.1 (2025-04-02). The entire library is `src/index.tsx`, about 200 lines, with no runtime dependencies and `react`/`react-dom` `>=17.0.2` as peers. State is in-memory React reducer state only. 2.0.0 added generics and string ids; 2.0.1 removed TypeScript `as` casts. Stable, small, fully covered by `src/index.test.tsx`.

## When to read this doc

- You change anything exported from `src/index.tsx`: `WizardProvider`, `Steps`, `Step`, `useWizardContext` or `DefaultWizardStepProps`.
- You change the reducer, its actions or the meaning of `goTo`, `onNext`, `onPrevious` or `setSteps`.
- You change the error messages thrown for misuse; consumers and tests assert on them.
- You touch build outputs, `peerDependencies` or the `bundlesize` budgets.

## Public API

| Export | Kind | Signature | Notes |
|---|---|---|---|
| `DefaultWizardStepProps` | type | `interface DefaultWizardStepProps { id: number \| string }` | Base shape of a step. Extend it for custom step data and pass the result as the generic to `useWizardContext<T>()`. |
| `WizardProvider` | component | `WizardProvider<T extends DefaultWizardStepProps>({ children }: { children: ReactNode }): JSX.Element` | Owns the state `{ activeStepIndex: 0, steps: [] }` and provides a memoised context. Required above `Steps` and every `useWizardContext` call. |
| `Steps` | component | `Steps({ children }: { children: JSX.Element \| JSX.Element[] }): JSX.Element` | Accepts only `Step` elements as direct children and at least one. Registers `{ id }` per child through `setSteps` when the count changes, then renders the active child only. |
| `Step` | component | `Step({ id, children }: { id: string; children: ReactNode }): JSX.Element` | Renders `<div id={id}>{children}</div>`. The prop is typed `string`; the runtime, README and changelog also accept numbers. See Behaviour. |
| `useWizardContext` | hook | `useWizardContext<T extends DefaultWizardStepProps = DefaultWizardStepProps>(): Readonly<WizardStepperContextProps<T>>` | Throws outside a `WizardProvider`. Returns `activeStepIndex`, `steps`, `isFirstStep`, `isLastStep`, `goTo`, `onNext`, `onPrevious`, `getActiveStep`, `setSteps`. `WizardStepperContextProps` itself is not exported. |

## Options and defaults

`WizardProvider` and `Steps` take no props besides `children`. `Step` takes `id` (typed `string`) and `children`. `useWizardContext<T>()` takes one generic, `T extends DefaultWizardStepProps`, defaulting to `DefaultWizardStepProps` (`{ id: number | string }`); `steps`, `setSteps` and `getActiveStep` are typed with `T`.

The hook returns:

| Member | Type | Default or behaviour |
|---|---|---|
| `activeStepIndex` | `number` | `0` |
| `steps` | `T[]` | `[]` until `Steps` registers its children or you call `setSteps` |
| `isFirstStep` | `boolean` | `activeStepIndex === 0` |
| `isLastStep` | `boolean` | `activeStepIndex >= steps.length - 1`, so `true` while `steps` is empty |
| `onNext(cb?)` | `(cb?: () => void) => void` | Awaits `cb` if given, then moves forward one step; no-op on the last step |
| `onPrevious()` | `() => void` | Moves back one step; no-op on the first step |
| `goTo(idOrIndex)` | `(id: number \| string) => void` | A number is an **index**, a string is matched against `step.id`; ignored when out of range or already active |
| `getActiveStep()` | `() => T` | `steps[activeStepIndex]`; `undefined` while `steps` is empty |
| `setSteps(steps)` | `(steps: T[]) => void` | Replaces the registered steps; use it to attach data to each step |

## Behaviour and edge cases

- **Fail fast on misuse.** `useWizardContext` throws `Please make sure you're wrapping all the steps in a 'WizardProvider' component` without a provider. `Steps` throws `Steps should have at least a single child component` with no valid children and `Error at position "<i>". You should compose Steps using "Step" component` when a child is not a `Step`. Wrapping `Step` in your own component therefore breaks `Steps`; compose inside the `Step` instead.
- **Navigation never throws.** Out-of-range `onNext`, `onPrevious` and `goTo` are ignored by the reducer. The ten tests in `src/index.test.tsx` cover these cases.
- **`goTo` semantics.** `goTo(1)` goes to the second step regardless of ids; `goTo('step3')` finds the step whose `id === 'step3'`. Changing this is a breaking change.
- **`onNext` is async.** The optional callback is awaited before `NEXT_PAGE` is dispatched, so an async validator that rejects keeps the wizard on the current step. The declared return type is `void`, so consumers cannot await it; in tests wrap the call in `await act(async () => ...)`.
- **Step registration is count-based.** `Steps` calls `setSteps` only when `steps.length !== children.length`. Changing a child's `id` without changing the count does not re-register; neither does `setSteps` with the same length followed by a child change. Data attached through `setSteps` is kept until the count changes.
- **First render.** `steps` is `[]` until the registration effect runs, so `isLastStep` is `true` and `getActiveStep()` is `undefined` for that render.
- **`Step` ids.** `DefaultWizardStepProps.id` and `goTo` accept `number | string`, and the README shows numeric ids in `setSteps`, but the `Step` prop is typed `string`. Passing a number to `<Step id={0}>` is a TypeScript error today even though it works at runtime. Widening the prop type is a safe, non-breaking change; keep the README and this doc in sync when you do it.
- **Rendering.** `Steps` returns exactly one child (`children[activeStepIndex]`), and `Step` wraps content in a `div` whose DOM `id` is the step id. There are no styles, no transitions and no focus management.

## Server-side rendering

The library does not read `window`, `document` or any browser API, so `renderToString` of a wizard should work and will render the first step. This is not tested: there is no `test:ssr` script and no SSR test. Treat SSR support as unverified until one exists.

## Bundle and compatibility

- Formats: CommonJS (`main`: `dist/cjs/index.js`, ES5, with `types`: `dist/cjs/index.d.ts`), ESM (`module`: `dist/esm/index.js`), UMD (`browser`: `dist/umd/react-sweet-wizard.js`, global `ReactSweetWizard`, plus `.min.js` and `.min.js.gz`). `sideEffects: false`. The `es2015` and `es2020` fields in `package.json` point at outputs the build does not produce.
- Peer dependencies: `react >=17.0.2`, `react-dom >=17.0.2`; no runtime dependencies
- Size budget: `bundlesize` in `package.json`: UMD plain, min and gz `1.1KB` each, CJS `2.6KB`, ESM `1.2KB`. Run `npm run build && npm run bundlesize`.

## Testing

| Area | Where |
|---|---|
| unit (provider, hook, Steps/Step, reducer paths) | `src/index.test.tsx` |
| coverage thresholds | `jest.config.js` |

## Key source files

- `src/index.tsx`
- `src/index.test.tsx`
- `package.json`
- `rollup.config.js`
- `tsconfig.build.json`
- `jest.config.js`

## Related documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [TESTING-GUIDE.md](../TESTING-GUIDE.md)
- [playbooks/RELEASE-WORKFLOW.md](../playbooks/RELEASE-WORKFLOW.md)
- [README.md (consumer-facing usage)](../../README.md)

