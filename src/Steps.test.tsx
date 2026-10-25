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

  describe.each(['before Steps', 'after Steps', 'inside a Step'] as const)(
    'when a consumer attaches data with setSteps %s',
    placement => {
      it('keeps the data while the ids still match, comparing ids as strings', async () => {
        const onSteps = vi.fn<OnSteps>();
        const named = [
          { id: '0', name: 'first' },
          { id: '1', name: 'second' },
        ];
        const Consumer = (): null => {
          const { setSteps } = useWizardContext<
            DefaultWizardStepProps & { name?: string }
          >();
          useEffect(() => {
            setSteps(named);
          }, [setSteps]);
          return null;
        };
        render(
          <WizardProvider>
            <StepsObserver onSteps={onSteps} />
            {placement === 'before Steps' && <Consumer />}
            <Steps>
              <Step id={0}>
                zero{placement === 'inside a Step' && <Consumer />}
              </Step>
              <Step id={1}>one</Step>
            </Steps>
            {placement === 'after Steps' && <Consumer />}
          </WizardProvider>
        );

        await act(async () => undefined);

        expect(onSteps).toHaveBeenLastCalledWith(named);
      });
    }
  );

  it('moves to the new last step when the active last step is removed', async () => {
    const onSteps = vi.fn<OnSteps>();
    const Probe = (): null => {
      const { goTo } = useWizardContext();
      useEffect(() => {
        goTo(2);
      }, [goTo]);
      return null;
    };
    const { rerender } = render(
      <WizardProvider>
        <StepsObserver onSteps={onSteps} />
        <Steps>
          <Step id="a">step a</Step>
          <Step id="b">step b</Step>
          <Step id="c">step c</Step>
        </Steps>
        <Probe />
      </WizardProvider>
    );
    expect(await screen.findByText('step c')).toBeInTheDocument();

    rerender(
      <WizardProvider>
        <StepsObserver onSteps={onSteps} />
        <Steps>
          <Step id="a">step a</Step>
          <Step id="b">step b</Step>
        </Steps>
        <Probe />
      </WizardProvider>
    );

    expect(await screen.findByText('step b')).toBeInTheDocument();
  });

  it('registers a single step whose id is an empty string', async () => {
    const onSteps = vi.fn<OnSteps>();

    render(<Wizard ids={['']} onSteps={onSteps} />);

    await waitFor(() => {
      expect(onSteps).toHaveBeenLastCalledWith([{ id: '' }]);
    });
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
