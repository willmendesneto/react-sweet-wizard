# React Sweet Wizard

[![Greenkeeper badge](https://badges.greenkeeper.io/willmendesneto/react-sweet-wizard.svg)](https://greenkeeper.io/)
[![npm](https://img.shields.io/badge/stackblitz-online-orange.svg)](https://stackblitz.com/edit/react-sweet-wizard-sample)

[![npm version](https://badge.fury.io/js/react-sweet-wizard.svg)](http://badge.fury.io/js/react-sweet-wizard) [![npm downloads](https://img.shields.io/npm/dm/react-sweet-wizard.svg)](https://npmjs.org/react-sweet-wizard)

[![Build Status](https://circleci.com/gh/willmendesneto/react-sweet-wizard.svg?style=shield)](https://circleci.com/gh/willmendesneto/react-sweet-wizard)

Your module to handle with Form Wizards in ReactJS applications easier.

## Why you shoud use React Sweet Wizard

Well, there are several selling points, actually!

- 🤘 Full Typescript support: It embraces Typescript for real! It accepts interfaces and types as generics for their data structures and more!
- 🏆 Better Developer Experience (DX): It enforces some conventions in order to make sure we got you covered! Issues with things such as specific components that needs to be used, which component is incorrect and context that needs to be used as wrapper will be raised straightaway on development environment.
- 🎯 Covers different usage and scenarios: It covers simple usage, but also covers scenarios when you have steps being added dinamically, specific validation steps that needs to be added, data structures that should be passed on, etc. The sky is the limit here!
- 🤩 No external dependencies: And that's exactly what you read. This is a zero-dependencies package, so you can integrate with Material-UI, Chakra-UI or any other Design System you might be using - including your own. Feel free to integrate with your workflow as you wish
- 🗜 Small bundle: All of that in only 1.58KB

---

- [Install](#install)
- [Setup](#setup)
- [Usage](#usage)
- [Releases](#releases)
- [Demo](#demo)

## Install

You can get it on NPM installing `react-sweet-wizard` module as a project dependency.

```shell
npm install react-sweet-wizard --save
# or
yarn add react-sweet-wizard
```

You can also use the standalone UMD build by including `dist/react-sweet-wizard.js` in your page. If you do this you'll also need to include the dependencies. For example:

```html
<script src="https://unpkg.com/react@<package-version></package-version>/dist/react.js"></script>
<script src="https://unpkg.com/react-dom@<package-version>/dist/react-dom.js"></script>
<script src="https://unpkg.com/react-sweet-wizard/dist/umd/react-sweet-wizard.js"></script>
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
    <Step key="0" id="0">
      <div>
        <p>step 1</p>
      </div>
    </Step>
    <Step key="1" id="1">
      <div>
        <p>step 2</p>
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

### Run the bundlesize check

```bash
$ npm run bundlesize
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
import { useWizardContext, DefaultWizardStepProps } from 'react-sweet-wizard'
...
// Creating a data structure interface
// To be used for steps
interface MyWizardSteps extends DefaultWizardStepProps {
  name: string;
}
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

Sets a new value for steps to be used and accessed across components. It covers scenarios such as steps with complex data structures.
It will use the defined Generic interface for it. Otherwise, it follows `DefaultWizardStepProps` interface.

```tsx

import { useWizardContext, DefaultWizardStepProps } from 'react-sweet-wizard'

// Creating a data structure interface
// To be used for steps
interface MyWizardSteps extends DefaultWizardStepProps {
  name: string;
}
...
// Yay! You can use generics to enforce the data structure
// used for steps
const { setSteps } = useWizardContext<MyWizardSteps>();
// Updating the mapped steps
setSteps([
  { id: 0, name: 'first'},
  { id: 1, name: 'second'},
])
...
```

### `getActiveStep()`

Returns a data structure value for the current step to be used and accessed across components. It covers scenarios such as steps with complex data structures.

It will use the defined Generic interface for it. Otherwise, it follows `DefaultWizardStepProps` interface.

```tsx
import { useWizardContext } from 'react-sweet-wizard'
...
// Yay! You can use generics to enforce the data structure
// used for steps
const { getActiveStep, onNext } = useWizardContext();
// Adding 2 steps
setSteps([
  { id: 0 },
  { id: 1 },
])
// Returns the first step since the wizard is following the common flow
//   { id: 0 }
getActiveStep()
// Moving wizard to the second step
onNext()
// Returns the second step
//   { id: 1 }
getActiveStep()
...
```

### `onNext(cb?: () => void)`

Moves the wizard to the next step. It also accepts a callback, in case you need to manage any specific handler. E.G.

```tsx
import { useWizardContext } from 'react-sweet-wizard'
...
// Yay! You can use generics to enforce the data structure
// used for steps
const { setSteps, onNext } = useWizardContext();
...
// Adding 2 steps
setSteps([
  { id: 0},
  { id: 1},
  { id: 2},
])
// Moving wizard to the second step
onNext()
onNext(() => {
  alert('And here we go! 🚀');
  // You can add a specific validation here!
})
```

### `onPrevious()`

Moves the wizard to the previous step.

```tsx
import { useWizardContext } from 'react-sweet-wizard'
...
// Yay! You can use generics to enforce the data structure
// used for steps
const { setSteps, onPrevious } = useWizardContext();
...
// Adding 2 steps
setSteps([
  { id: 0},
  { id: 1},
])
// Moving wizard to the second step
onNext()
// Moving wizard back to the first step
onPrevious()
```

### `goTo(id: number | string)`

Moves the wizard to a specific step. Interesting if you have some advanced scenario

```tsx
import { useWizardContext, DefaultWizardStepProps } from 'react-sweet-wizard'

// Creating a data structure interface
// To be used for steps
interface MyWizardSteps extends DefaultWizardStepProps {
  name: string;
}
...
// Yay! You can use generics to enforce the data structure
// used for steps
const { setSteps, goTo, getActiveStep } = useWizardContext<MyWizardSteps>();
...
// Updating the mapped steps
setSteps([
  { id: 0, name: 'first'},
  { id: 1, name: 'second'},
])
// Moving wizard to second step
goTo(1)
//
const step = getActiveStep()
// Output
//   { id: 1, name: 'second'}
// It's using `MyWizardSteps` interface, so don't worry
console.log(step)
```

## Publish

this project is using `np` package to publish, which makes things straightforward. EX: `np <patch|minor|major>`

> For more details, [please check np package on npmjs.com](https://www.npmjs.com/package/np)

## Author

**Wilson Mendes (willmendesneto)**

- <https://twitter.com/willmendesneto>
- <http://github.com/willmendesneto>
