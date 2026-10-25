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
  const childIds = reactChildren.map(child => child.props.id);

  const { activeStepIndex, setSteps, steps } =
    useWizardContext<DefaultWizardStepProps>();

  // Ids are compared as strings: <Step id={0}> and setSteps([{ id: '0' }]) describe the same step.
  const registered = steps.map(step => step.id).join('\0');
  const expected = childIds.join('\0');

  useEffect(() => {
    if (registered !== expected) {
      setSteps(childIds.map(id => ({ id })));
    }
  }, [setSteps, registered, expected, childIds]);

  if (reactChildren.length === 0) {
    throw new Error('Steps should have at least a single child component');
  }

  const index = reactChildren.findIndex(child => child.type !== Step);

  if (index !== -1) {
    throw new Error(
      `Error at position "${index}". You should compose Steps using "Step" component`
    );
  }

  return reactChildren[activeStepIndex];
};
