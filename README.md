# React Sweet Wizard

[![Greenkeeper badge](https://badges.greenkeeper.io/willmendesneto/react-sweet-wizard.svg)](https://greenkeeper.io/)
[![npm](https://img.shields.io/badge/stackblitz-online-orange.svg)](https://stackblitz.com/edit/react-sweet-wizard-sample)

[![npm version](https://badge.fury.io/js/react-sweet-wizard.svg)](http://badge.fury.io/js/react-sweet-wizard) [![npm downloads](https://img.shields.io/npm/dm/react-sweet-wizard.svg)](https://npmjs.org/react-sweet-wizard)

[![Build Status](https://circleci.com/gh/willmendesneto/react-sweet-wizard.svg?style=shield)](https://circleci.com/gh/willmendesneto/react-sweet-wizard)

Your module to handle with Form Wizards in ReactJS applications easier.

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
import React, { Component } from 'react';
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

Try out the [demo](https://stackblitz.com/edit/react-sweet-wizard-sample)!

## Publish

this project is using `np` package to publish, which makes things straightforward. EX: `np <patch|minor|major>`

> For more details, [please check np package on npmjs.com](https://www.npmjs.com/package/np)

## Author

**Wilson Mendes (willmendesneto)**

- <https://twitter.com/willmendesneto>
- <http://github.com/willmendesneto>
