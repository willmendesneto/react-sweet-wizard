import type { ReactElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Step } from './Step';
import { Steps } from './Steps';
import { useWizardContext } from './useWizardContext';
import { WizardProvider } from './WizardProvider';

const RegisteredSteps = (): ReactElement => {
  const { steps } = useWizardContext();
  return <output data-testid="steps">{JSON.stringify(steps)}</output>;
};

describe('Step', () => {
  it('renders a numeric id as the element id', () => {
    render(<Step id={0}>first</Step>);

    expect(screen.getByText('first')).toHaveAttribute('id', '0');
  });

  it('renders a string id as the element id', () => {
    render(<Step id="b">second</Step>);

    expect(screen.getByText('second')).toHaveAttribute('id', 'b');
  });

  it('registers numeric and string ids with their original types', async () => {
    render(
      <WizardProvider>
        <RegisteredSteps />
        <Steps>
          <Step id={0}>first</Step>
          <Step id="b">second</Step>
        </Steps>
      </WizardProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('steps')).toHaveTextContent(
        JSON.stringify([{ id: 0 }, { id: 'b' }])
      );
    });
  });
});
