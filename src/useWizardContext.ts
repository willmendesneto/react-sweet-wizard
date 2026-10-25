import { useContext } from 'react';
import { WizardStepperContext } from './context';
import type { DefaultWizardStepProps, WizardContextValue } from './types';

export const useWizardContext = <T extends DefaultWizardStepProps>(): Readonly<
  WizardContextValue<T>
> => {
  const context: Readonly<WizardContextValue<T>> | null =
    useContext(WizardStepperContext);
  if (!context) {
    throw new Error(
      `Please make sure you're wrapping all the steps in a 'WizardProvider' component`
    );
  }
  return context;
};
