# React Sweet Wizard

[![npm](https://img.shields.io/badge/stackblitz-online-orange.svg)](https://stackblitz.com/edit/react-sweet-wizard-sample)

[![npm version](https://badge.fury.io/js/react-sweet-wizard.svg)](http://badge.fury.io/js/react-sweet-wizard) [![npm downloads](https://img.shields.io/npm/dm/react-sweet-wizard.svg)](https://npmjs.org/react-sweet-wizard)

[![Coverage Status](https://coveralls.io/repos/github/willmendesneto/react-sweet-wizard/badge.svg?branch=main)](https://coveralls.io/github/willmendesneto/react-sweet-wizard?branch=main) [![CI](https://github.com/willmendesneto/react-sweet-wizard/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/willmendesneto/react-sweet-wizard/actions/workflows/ci.yml)

Your module to handle with Form Wizards in ReactJS applications easier.

## Why you shoud use React Sweet Wizard

Well, there are several selling points, actually!

- 🤘 Full Typescript support: It embraces Typescript for real! It accepts interfaces and types as generics for their data structures and more!
- 🏆 Better Developer Experience (DX): It enforces some conventions in order to make sure we got you covered! Issues with things such as specific components that needs to be used, which component is incorrect and context that needs to be used as wrapper will be raised straightaway on development environment.
- 🎯 Covers different usage and scenarios: It covers simple usage, but also covers scenarios when you have steps being added dinamically, specific validation steps that needs to be added, data structures that should be passed on, etc. The sky is the limit here!
- 🤩 No external dependencies: And that's exactly what you read. This is a zero-dependencies package, so you can integrate with Material-UI, Chakra-UI or any other Design System you might be using - including your own. Feel free to integrate with your workflow as you wish
- 🗜 Small bundle: about 1.45 KB gzipped (ESM and CJS), with a 1.5 KB budget checked on every CI run by `size-limit`

---

- [Install](#install)
- [Setup](#setup)
- [Demo](#demo)
- [useWizardContext](#usewizardcontext)
- [Release](#release)

## Install

Requires React 18 or later (`react` as a peer dependency) and Node 22 or later. React 17 users should stay on 2.x.

You can get it on NPM installing `react-sweet-wizard` module as a project dependency.

```shell
npm install react-sweet-wizard --save
# or
yarn add react-sweet-wizard
```

## Setup

You'll need to import `WizardProvider` and add it into the root component of your application. So that you can create your wizard steps by using `Steps`, `Step` and control them via `useWizardContext` hook.

```javascript
import {
  useWizardContext,
  WizardProvider,
  Steps,
  Step,
} from 'react-sweet-wizard';

const Progress = () => {
  const { activeStepIndex, steps } = useWizardContext();

  return (
    <div>
      State {activeStepIndex + 1} of {steps.length}
    </div>
  );
};

const WizardSteps = () => (
  <Steps>
    {/* `id` can be a number or a string */}
    <Step key={0} id={0}>
      <div>
        <p>step 1</p>
      </div>
    </Step>
    <Step key="1" id="1">
      <div>
        <p>step 2</p>
      </div>
    </Step>
    <Step key="step3" id="step3">
      <div>
        <p>step 3</p>
      </div>
    </Step>
  </Steps>
);

const App = () => (
  <WizardProvider>
    <Progress />
    <WizardSteps />
  </WizardProvider>
);

export default App;
```

# Demo

Try out the demo on Stackblitz!

[React Sweet Wizard Playground](https://stackblitz.com/edit/react-sweet-wizard-sample)!

### Run the tests

```bash
$ npm test
```

### Run the build

```bash
$ npm run build
```

### Run the size budget check

```bash
$ npm run size
```

### Run the code lint

```bash
$ npm run lint
```

## `useWizardContext`

This package exposes a hook with a few different methods which you can interact.

### Using Generics for data structure steps

The hook accepts a generic as data structure. If you don't pass anything, it will use `DefaultWizardStepProps` as default one. Otherwise, it will use the one you defined.

> To define a new interface and pass as a generic you should extends from `DefaultWizardStepProps`

```tsx
import { useWizardContext, DefaultWizardStepProps } from 'react-sweet-wizard';
...
// Creating a data structure interface
// To be used for steps
interface MyWizardSteps extends DefaultWizardStepProps {
  name: string;
};
...
// Yay! You can use generics to enforce the data structure
// used for steps
const ctx = useWizardContext<MyWizardSteps>();
// ✨ where the magic happens ✨
```

### Read-only values

- `steps`: You can check how many steps are available on the wizard. Interesting to be used if you're adding dynamic nodes, as an example
- `activeStepIndex`: A number referencing which step is visible on your wizard
- `isFirstStep`: A boolean that can be used to check if the current step is the first one on your wizard
- `isLastStep`: A boolean that can be used to check if the current step is the last one on your wizard

### `setSteps(steps: T[])`

Sets a new value for steps to be used and accessed across components. It covers scenarios such as steps with complex data structures. Steps registered automatically by `<Steps>` carry only `id`, so declare your extra fields optional or call `setSteps` before reading them; the data you set is kept as long as the step ids match the `<Step>` children.
It will use the defined Generic interface for it. Otherwise, it follows `DefaultWizardStepProps` interface.

```tsx

import { useWizardContext, DefaultWizardStepProps } from 'react-sweet-wizard';

// Creating a data structure interface
// To be used for steps
interface MyWizardSteps extends DefaultWizardStepProps {
  name: string;
};
...
// Yay! You can use generics to enforce the data structure
// used for steps
const { setSteps } = useWizardContext<MyWizardSteps>();
// Updating the mapped steps
setSteps([
  { id: 0, name: 'first'},
  { id: 1, name: 'second'},
  { id: 'step3', name: 'third'},
]);
...
```

### `getActiveStep()`

Returns a data structure value for the current step to be used and accessed across components. It covers scenarios such as steps with complex data structures.

It will use the defined Generic interface for it. Otherwise, it follows `DefaultWizardStepProps` interface.

```tsx
import { useWizardContext } from 'react-sweet-wizard';
...
// Yay! You can use generics to enforce the data structure
// used for steps
const { getActiveStep, onNext } = useWizardContext();
// Adding 3 steps
setSteps([
  { id: 0 },
  { id: 1 },
  { id: 'step3' },
]);
// Returns the first step since the wizard is following the common flow
//   { id: 0 }
getActiveStep();
// Moving wizard to the second step
onNext();
// Returns the second step
//   { id: 1 }
getActiveStep();
...
```

### `onNext(cb?: () => void | Promise<void>): Promise<void>`

Moves the wizard to the next step and returns a promise that resolves after the move. It also accepts a callback, sync or async, that runs before the move; if the callback throws or rejects, the wizard stays on the current step and the promise rejects with that error. E.G.

```tsx
import { useWizardContext } from 'react-sweet-wizard';
// Creating a data structure interface
// To be used for steps
interface MyWizardSteps extends DefaultWizardStepProps {
  name: string;
};
...
// Yay! You can use generics to enforce the data structure
// used for steps
const { setSteps, onNext } = useWizardContext<MyWizardSteps>();
...
// Adding 3 steps
setSteps([
  { id: 0, name: 'first'},
  { id: 1, name: 'second'},
  { id: 'step3', name: 'third'},
]);
// Moving wizard to the second step
onNext();
onNext(() => {
  alert('And here we go! 🚀');
  // You can add a specific validation here!
});
// Async validation: the wizard only advances when the callback resolves
try {
  await onNext(async () => {
    await validateCurrentStep();
  });
} catch (error) {
  // validation failed; still on the same step
}
```

### `onPrevious()`

Moves the wizard to the previous step.

```tsx
import { useWizardContext } from 'react-sweet-wizard';
...
// Yay! You can use generics to enforce the data structure
// used for steps
const { setSteps, onPrevious } = useWizardContext();
...
// Adding 2 steps
setSteps([
  { id: 0},
  { id: 1},
]);
// Moving wizard to the second step
onNext();
// Moving wizard back to the first step
onPrevious();
```

### `goTo(indexOrId: number | string)`

Moves the wizard to a specific step. A **number is the step index** (`goTo(1)` is always the second step); a **string is matched against the step id** (`goTo('step3')`, and `goTo('10')` finds `<Step id={10}>`). A numeric argument is never matched against ids, so pass a numeric id as a string. Out-of-range calls are ignored.

```tsx
import { useWizardContext, DefaultWizardStepProps } from 'react-sweet-wizard';

// Creating a data structure interface
// To be used for steps
interface MyWizardSteps extends DefaultWizardStepProps {
  name: string;
};
...
// Yay! You can use generics to enforce the data structure
// used for steps
const { setSteps, goTo, getActiveStep } = useWizardContext<MyWizardSteps>();
...
// Updating the mapped steps
setSteps([
  { id: 0, name: 'first'},
  { id: 1, name: 'second'},
  { id: 'step3', name: 'third'},
]);
// Moving wizard to second step
goTo(1);
// Output
//   { id: 1, name: 'second'}
// It's using `MyWizardSteps` interface, so don't worry
console.log(getActiveStep());
// Moving wizard to third step
goTo('step3');
// Output
//   { id: 'step3', name: 'third'}
console.log(getActiveStep());
```

## Release

Releases are cut with `npm version <patch|minor|major>` (it runs lint, types and tests, then moves the `## [Unreleased]` changelog entries under the new version), followed by pushing the commit and its tag (`git push --follow-tags`), which triggers the GitHub Release workflow, and a manual `npm publish`. The full flow lives in [docs/playbooks/RELEASE-WORKFLOW.md](docs/playbooks/RELEASE-WORKFLOW.md).

## Author

**Wilson Mendes (willmendesneto)**

- <http://github.com/willmendesneto>
