import { createContext } from 'react';
import type { WizardContextValue } from './types';

export const WizardStepperContext =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic per consumer, narrowed by useWizardContext<T>
  createContext<WizardContextValue<any> | null>(null);

// Internal: lets Steps register its children's ids without widening the public context value.
export const RegisterStepIdsContext = createContext<
  ((ids: (number | string)[]) => void) | null
>(null);
