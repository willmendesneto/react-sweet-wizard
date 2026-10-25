import type { ReactElement } from 'react';
import type { StepProps } from './types';

export const Step = ({ id, children }: StepProps): ReactElement => (
  <div id={id}>{children}</div>
);
