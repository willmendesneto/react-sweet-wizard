import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Step } from './Step';
import { Steps } from './Steps';
import type { DefaultWizardStepProps } from './types';
import { useWizardContext } from './useWizardContext';
import { WizardProvider } from './WizardProvider';

type OnSteps = (steps: readonly DefaultWizardStepProps[]) => void;

// Reports every change of the registered steps, so tests can count re-registrations.
const StepsObserver = ({ onSteps }: { onSteps: OnSteps }): null => {
  const { steps } = useWizardContext();
  useEffect(() => {
    onSteps(steps);
  }, [steps, onSteps]);
  return null;
};

const Wizard = ({
  ids,
  onSteps,
}: {
  ids: readonly (number | string)[];
  onSteps: OnSteps;
}): ReactElement => (
  <WizardProvider>
    <StepsObserver onSteps={onSteps} />
    <Steps>
      {ids.map(id => (
        <Step key={id} id={id}>
          step {String(id)}
        </Step>
      ))}
    </Steps>
  </WizardProvider>
);

const expectRenderToThrow = (renderFn: () => unknown, message: string) => {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  expect(renderFn).toThrow(message);
  spy.mockRestore();
};

describe('Steps', () => {
  it('registers the children ids once and renders the first step', async () => {
    const onSteps = vi.fn<OnSteps>();

    render(<Wizard ids={['a', 'b', 'c']} onSteps={onSteps} />);

    await waitFor(() => {
      expect(onSteps).toHaveBeenLastCalledWith([
        { id: 'a' },
        { id: 'b' },
        { id: 'c' },
      ]);
    });
    expect(onSteps).toHaveBeenCalledTimes(2); // initial [] and the registration
    expect(screen.getByText('step a')).toBeInTheDocument();
  });

  it('does not re-register when a re-render keeps the same ids', async () => {
    const onSteps = vi.fn<OnSteps>();
    const { rerender } = render(
      <Wizard ids={['a', 'b', 'c']} onSteps={onSteps} />
    );
    await waitFor(() => expect(onSteps).toHaveBeenCalledTimes(2));

    rerender(<Wizard ids={['a', 'b', 'c']} onSteps={onSteps} />);

    expect(onSteps).toHaveBeenCalledTimes(2);
  });

  it('re-registers when a child id changes without changing the count', async () => {
    const onSteps = vi.fn<OnSteps>();
    const { rerender } = render(
      <Wizard ids={['a', 'b', 'c']} onSteps={onSteps} />
    );
    await waitFor(() => expect(onSteps).toHaveBeenCalledTimes(2));

    rerender(<Wizard ids={['a', 'x', 'c']} onSteps={onSteps} />);

    await waitFor(() => {
      expect(onSteps).toHaveBeenLastCalledWith([
        { id: 'a' },
        { id: 'x' },
        { id: 'c' },
      ]);
    });
    expect(onSteps).toHaveBeenCalledTimes(3);
  });

  it('keeps data attached through setSteps when the ids still match, comparing ids as strings', async () => {
    const onSteps = vi.fn<OnSteps>();
    const Consumer = (): null => {
      const { setSteps } = useWizardContext<
        DefaultWizardStepProps & { name?: string }
      >();
      useEffect(() => {
        setSteps([
          { id: '0', name: 'first' },
          { id: '1', name: 'second' },
        ]);
      }, [setSteps]);
      return null;
    };
    render(
      <WizardProvider>
        <StepsObserver onSteps={onSteps} />
        <Steps>
          <Step id={0}>zero</Step>
          <Step id={1}>one</Step>
        </Steps>
        <Consumer />
      </WizardProvider>
    );

    await waitFor(() => {
      expect(onSteps).toHaveBeenLastCalledWith([
        { id: '0', name: 'first' },
        { id: '1', name: 'second' },
      ]);
    });
    await act(async () => undefined);
    expect(onSteps).toHaveBeenLastCalledWith([
      { id: '0', name: 'first' },
      { id: '1', name: 'second' },
    ]);
  });

  it('throws the 2.0.1 message when a child is not a Step', () => {
    expectRenderToThrow(
      () =>
        render(
          <WizardProvider>
            <Steps>
              <div>not a step</div>
            </Steps>
          </WizardProvider>
        ),
      'Error at position "0". You should compose Steps using "Step" component'
    );
  });

  it('throws the 2.0.1 message when there are no children', () => {
    expectRenderToThrow(
      () =>
        render(
          <WizardProvider>
            <Steps>{[]}</Steps>
          </WizardProvider>
        ),
      'Steps should have at least a single child component'
    );
  });
});
