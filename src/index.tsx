import React, {
  Children,
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
  useMemo,
  useEffect,
} from 'react';

interface WizardStepperReducerState<T> {
  activeStepIndex: number;
  steps: T[];
}

type Action<T> =
  | { type: 'NEXT_PAGE' }
  | { type: 'PREV_PAGE' }
  | { type: 'GOTO_PAGE'; payload: { stepId: number | string } }
  | {
      type: 'SET_STEP_COUNT';
      payload: { steps: T[] };
    };

export interface DefaultWizardStepProps {
  id: number | string;
}

interface WizardStepperContextProps<T = DefaultWizardStepProps> {
  activeStepIndex: number;
  steps: T[];
  isFirstStep: boolean;
  isLastStep: boolean;
  goTo: (id: number | string) => void;
  onNext: (cb?: () => void) => void;
  getActiveStep: () => T;
  onPrevious: () => void;
  setSteps: (steps: T[] | T) => void;
}

const initialState = <
  T extends DefaultWizardStepProps
>(): WizardStepperReducerState<T> => ({
  activeStepIndex: 0,
  steps: [],
});

const WizardStepperContext =
  createContext<WizardStepperContextProps<any> | null>(null);

WizardStepperContext.displayName = 'WizardStepperContext';

export const useWizardContext = <T extends DefaultWizardStepProps>(): Readonly<
  WizardStepperContextProps<T>
> => {
  const context = useContext(WizardStepperContext);
  if (!context) {
    throw new Error(
      `Please make sure you're wrapping all the steps in a 'WizardProvider' component`
    );
  }
  return context as Readonly<WizardStepperContextProps<T>>;
};

const reducer = <T extends DefaultWizardStepProps>(
  state: WizardStepperReducerState<T>,
  action: Action<T>
): WizardStepperReducerState<T> => {
  const { steps, activeStepIndex } = state;

  switch (action.type) {
    case 'NEXT_PAGE':
      const newIndex = activeStepIndex + 1;
      if (newIndex < steps.length) {
        return { ...state, activeStepIndex: newIndex };
      }
      return state;
    case 'PREV_PAGE':
      if (activeStepIndex > 0) {
        return { ...state, activeStepIndex: activeStepIndex - 1 };
      }
      return state;

    case 'GOTO_PAGE':
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

    case 'SET_STEP_COUNT':
      const { steps: newSteps } = action.payload;
      return { ...state, steps: newSteps };
    default:
      return state;
  }
};

export const WizardProvider = <T extends DefaultWizardStepProps>({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState<T>());

  const { activeStepIndex, steps } = state;

  const onNext = useCallback(
    async (cb?: () => void) => {
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
      isLastStep: activeStepIndex >= steps.length - 1,
    }),
    [activeStepIndex, steps, goTo, onNext, onPrevious, setSteps, getActiveStep]
  );

  return (
    <WizardStepperContext.Provider value={context}>
      {children}
    </WizardStepperContext.Provider>
  );
};

export const Steps = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const reactChildren = Children.toArray(children);
  if (reactChildren.length === 0) {
    throw new Error('Steps should have at least a single child component');
  }

  const index = reactChildren.findIndex(
    child => (child as JSX.Element).type !== Step
  );

  if (index !== -1) {
    throw new Error(
      `Error at position "${index}". You should compose Steps using "Step" component`
    );
  }

  const { activeStepIndex, setSteps, steps } =
    useWizardContext<DefaultWizardStepProps>();

  useEffect(() => {
    if (steps.length !== reactChildren.length) {
      setSteps(
        reactChildren.map(child => ({
          id: (child as JSX.Element).props.id,
        }))
      );
    }
  }, [setSteps, steps, reactChildren]);

  return reactChildren[activeStepIndex] as JSX.Element;
};

export const Step = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode | JSX.Element | JSX.Element[];
}) => <div id={id}>{children}</div>;
