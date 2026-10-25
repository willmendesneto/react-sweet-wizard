export interface DefaultWizardStepProps {
  id: number | string;
}

export interface WizardState<T> {
  activeStepIndex: number;
  steps: T[];
}

export type Action<T> =
  | { type: 'NEXT_PAGE' }
  | { type: 'PREV_PAGE' }
  | { type: 'GOTO_PAGE'; payload: { stepId: number | string } }
  | { type: 'SET_STEP_COUNT'; payload: { steps: T[] } };

export interface WizardContextValue<T = DefaultWizardStepProps> {
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
