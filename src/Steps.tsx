import type { ReactElement } from 'react';
import { Children, isValidElement, useContext, useEffect } from 'react';
import { RegisterStepIdsContext } from './context';
import type { StepProps } from './Step';
import { Step } from './Step';
import { useWizardContext } from './useWizardContext';

export const Steps = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}): ReactElement | null => {
  const reactChildren = Children.toArray(children).filter(
    (child): child is ReactElement<StepProps> =>
      isValidElement<StepProps>(child)
  );
  const childIds = reactChildren.map(child => child.props.id);
  // A stable key: register only when this block's own ids change, never on every render,
  // so several Steps under one provider cannot keep replacing each other's registration.
  const idsKey = JSON.stringify(childIds);

  const { activeStepIndex } = useWizardContext();
  const registerStepIds = useContext(RegisterStepIdsContext);

  // The reducer compares against the latest state and keeps it when the ids match,
  // so data a consumer attached through setSteps survives whichever effect runs first.
  useEffect(() => {
    registerStepIds?.(JSON.parse(idsKey));
  }, [registerStepIds, idsKey]);

  if (reactChildren.length === 0) {
    throw new Error('Steps should have at least a single child component');
  }

  const index = reactChildren.findIndex(child => child.type !== Step);

  if (index !== -1) {
    throw new Error(
      `Error at position "${index}". You should compose Steps using "Step" component`
    );
  }

  return reactChildren[activeStepIndex] ?? null;
};
