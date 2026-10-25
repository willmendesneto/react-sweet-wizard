import type { ReactElement } from 'react';
import { Children, isValidElement, useEffect } from 'react';
import type { StepProps } from './Step';
import { Step } from './Step';
import type { DefaultWizardStepProps } from './types';
import { useWizardContext } from './useWizardContext';

export const Steps = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}): ReactElement => {
  const reactChildren = Children.toArray(children).filter(
    (child): child is ReactElement<StepProps> =>
      isValidElement<StepProps>(child)
  );

  if (reactChildren.length === 0) {
    throw new Error('Steps should have at least a single child component');
  }

  const index = reactChildren.findIndex(child => child.type !== Step);

  if (index !== -1) {
    throw new Error(
      `Error at position "${index}". You should compose Steps using "Step" component`
    );
  }

  const { activeStepIndex, setSteps, steps } =
    useWizardContext<DefaultWizardStepProps>();

  useEffect(() => {
    if (steps.length !== reactChildren.length) {
      setSteps(reactChildren.map(child => ({ id: child.props.id })));
    }
  }, [setSteps, steps, reactChildren]);

  return reactChildren[activeStepIndex];
};
