import type { Action, DefaultWizardStepProps, WizardState } from './types';

export const initialState = <
  T extends DefaultWizardStepProps,
>(): WizardState<T> => ({
  activeStepIndex: 0,
  steps: [],
});

// Ids are compared as strings: <Step id={0}> and { id: '0' } describe the same step.
const sameId = (a: number | string, b: number | string): boolean =>
  String(a) === String(b);

const withSteps = <T>(state: WizardState<T>, steps: T[]): WizardState<T> => ({
  steps,
  activeStepIndex: Math.min(
    state.activeStepIndex,
    Math.max(steps.length - 1, 0)
  ),
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
          : steps.findIndex(step => sameId(step.id, stepId));

      if (
        stepIndex > -1 &&
        steps.length > stepIndex &&
        stepIndex !== activeStepIndex
      ) {
        return { ...state, activeStepIndex: stepIndex };
      }
      return state;
    }
    case 'SET_STEP_COUNT':
      return withSteps(state, action.payload.steps);

    case 'REGISTER_STEP_IDS': {
      const { ids } = action.payload;
      const unchanged =
        ids.length === steps.length &&
        ids.every((id, index) => sameId(id, steps[index].id));
      // A cast is unavoidable here: Steps only knows ids, T may carry more fields.
      return unchanged
        ? state
        : withSteps(state, ids.map(id => ({ id })) as T[]);
    }
    default:
      return state;
  }
};
