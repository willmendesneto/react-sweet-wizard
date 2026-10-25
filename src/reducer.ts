import type { Action, DefaultWizardStepProps, WizardState } from './types';

export const initialState = <
  T extends DefaultWizardStepProps,
>(): WizardState<T> => ({
  activeStepIndex: 0,
  steps: [],
});

export const reducer = <T extends DefaultWizardStepProps>(
  state: WizardState<T>,
  action: Action<T>
): WizardState<T> => {
  const { steps, activeStepIndex } = state;

  switch (action.type) {
    case 'NEXT_PAGE': {
      const newIndex = activeStepIndex + 1;
      if (newIndex < steps.length) {
        return { ...state, activeStepIndex: newIndex };
      }
      return state;
    }
    case 'PREV_PAGE':
      if (activeStepIndex > 0) {
        return { ...state, activeStepIndex: activeStepIndex - 1 };
      }
      return state;

    case 'GOTO_PAGE': {
      const { stepId } = action.payload;
      const stepIndex =
        typeof stepId === 'number'
          ? stepId
          : steps.findIndex(step => step.id === stepId);

      if (
        stepIndex > -1 &&
        steps.length > stepIndex &&
        stepIndex !== activeStepIndex
      ) {
        return { ...state, activeStepIndex: stepIndex };
      }
      return state;
    }
    case 'SET_STEP_COUNT': {
      const { steps: newSteps } = action.payload;
      return { ...state, steps: newSteps };
    }
    default:
      return state;
  }
};
