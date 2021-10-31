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

interface WizardStepperReducerState {
  activeStepIndex: number;
  steps: DefaultWizardStepProps[];
}

type Action =
  | { type: 'NEXT_PAGE' }
  | { type: 'PREV_PAGE' }
  | { type: 'GOTO_PAGE'; payload: { stepId: number } }
  | {
      type: 'SET_STEP_COUNT';
      payload: { steps: DefaultWizardStepProps[] };
    };

export interface DefaultWizardStepProps {
  id: number | string;
}

interface WizardStepperContextProps<T = DefaultWizardStepProps> {
  readonly activeStepIndex: number;
  readonly steps: T[];
  readonly isFirstStep: boolean;
  readonly isLastStep: boolean;
  goTo: (id: number | string) => void;
  onNext: (cb?: () => void) => void;
  getActiveStep: () => T;
  onPrevious: () => void;
  setSteps: (steps: T[] | T) => void;
}

const initialState: WizardStepperReducerState = {
  activeStepIndex: 0,
  steps: [],
};

const WizardStepperContext = createContext({});

WizardStepperContext.displayName = 'WizardStepperContext';

export const useWizardContext = <T, _P = never>() => {
  const context = useContext(WizardStepperContext);
  if (Object.keys(context).length === 0) {
    throw new Error(
      `Please make sure you're wrapping all the steps in a 'WizardProvider' component`
    );
  }
  return context as WizardStepperContextProps<T>;
};

const reducer = (
  state: WizardStepperReducerState,
  action: Action
): WizardStepperReducerState => {
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
      if (activeStepIndex !== stepId && stepId < steps.length && stepId >= 0) {
        return { ...state, activeStepIndex: stepId };
      }
      return state;
    case 'SET_STEP_COUNT':
      const { steps: newSteps } = action.payload;
      return { ...state, steps: newSteps };
    default:
      return state;
  }
};

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
    (steps: DefaultWizardStepProps[]) => {
      dispatch({ type: 'SET_STEP_COUNT', payload: { steps } });
    },
    [dispatch]
  );

  const goTo = useCallback(
    stepId => {
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

interface StepsProps {
  children: JSX.Element | JSX.Element[];
}

export const Steps = ({ children }: StepsProps) => {
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

interface StepProps {
  id: string;
  children: ReactNode | JSX.Element | JSX.Element[];
}

export const Step = ({ id, children }: StepProps) => (
  <div id={id}>{children}</div>
);
