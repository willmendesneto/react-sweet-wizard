import type { ReactElement, ReactNode } from 'react';
import { useCallback, useMemo, useReducer } from 'react';
import { RegisterStepIdsContext, WizardStepperContext } from './context';
import { initialState, reducer } from './reducer';
import type { DefaultWizardStepProps } from './types';

export const WizardProvider = <T extends DefaultWizardStepProps>({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const [state, dispatch] = useReducer(reducer, initialState<T>());

  const { activeStepIndex, steps } = state;

  const onNext = useCallback(
    async (cb?: () => void | Promise<void>) => {
      if (typeof cb === 'function') {
        await cb();
      }
      dispatch({ type: 'NEXT_PAGE' });
    },
    [dispatch]
  );

  const onPrevious = useCallback(() => {
    dispatch({ type: 'PREV_PAGE' });
  }, [dispatch]);

  const setSteps = useCallback(
    (steps: T[]) => {
      dispatch({ type: 'SET_STEP_COUNT', payload: { steps } });
    },
    [dispatch]
  );

  const registerStepIds = useCallback(
    (ids: (number | string)[]) => {
      dispatch({ type: 'REGISTER_STEP_IDS', payload: { ids } });
    },
    [dispatch]
  );

  const goTo = useCallback(
    (stepId: number | string) => {
      dispatch({ type: 'GOTO_PAGE', payload: { stepId } });
    },
    [dispatch]
  );

  const getActiveStep = useCallback(
    () => steps[activeStepIndex],
    [activeStepIndex, steps]
  );

  const context = useMemo(
    () => ({
      activeStepIndex,
      steps,
      goTo,
      onNext,
      onPrevious,
      setSteps,
      getActiveStep,
      isFirstStep: activeStepIndex === 0,
      isLastStep: steps.length > 0 && activeStepIndex >= steps.length - 1,
    }),
    [activeStepIndex, steps, goTo, onNext, onPrevious, setSteps, getActiveStep]
  );

  return (
    <WizardStepperContext.Provider value={context}>
      <RegisterStepIdsContext.Provider value={registerStepIds}>
        {children}
      </RegisterStepIdsContext.Provider>
    </WizardStepperContext.Provider>
  );
};
