import type { ReactElement, ReactNode } from 'react';

export interface StepProps {
  id: number | string;
  children: ReactNode;
}

export const Step = ({ id, children }: StepProps): ReactElement => (
  <div id={String(id)}>{children}</div>
);
