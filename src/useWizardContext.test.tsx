import type { PropsWithChildren, ReactElement } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Step } from './Step';
import { Steps } from './Steps';
import { useWizardContext } from './useWizardContext';
import { WizardProvider } from './WizardProvider';

const NoSteps = ({ children }: PropsWithChildren): ReactElement => (
  <WizardProvider>{children}</WizardProvider>
);

const TwoSteps = ({ children }: PropsWithChildren): ReactElement => (
  <WizardProvider>
    {children}
    <Steps>
      <Step id="a">a</Step>
      <Step id="b">b</Step>
    </Steps>
  </WizardProvider>
);

describe('useWizardContext', () => {
  it('reports a wizard with no registered steps as not last and without an active step', () => {
    const { result } = renderHook(() => useWizardContext(), {
      wrapper: NoSteps,
    });

    expect(result.current.steps).toEqual([]);
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(false);
    expect(result.current.getActiveStep()).toBeUndefined();
  });

  it('reports first and last step once steps are registered', async () => {
    const { result } = renderHook(() => useWizardContext(), {
      wrapper: TwoSteps,
    });
    await waitFor(() => expect(result.current.steps).toHaveLength(2));

    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(false);

    await act(async () => {
      await result.current.onNext();
    });

    expect(result.current.isFirstStep).toBe(false);
    expect(result.current.isLastStep).toBe(true);
  });

  it('onNext returns a promise that resolves after the step advanced', async () => {
    const { result } = renderHook(() => useWizardContext(), {
      wrapper: TwoSteps,
    });
    await waitFor(() => expect(result.current.steps).toHaveLength(2));

    let pending: Promise<void> | undefined;
    await act(async () => {
      pending = result.current.onNext();
      await pending;
    });

    expect(pending).toBeInstanceOf(Promise);
    expect(result.current.activeStepIndex).toBe(1);
  });

  it('onNext awaits a resolving callback before advancing', async () => {
    const { result } = renderHook(() => useWizardContext(), {
      wrapper: TwoSteps,
    });
    await waitFor(() => expect(result.current.steps).toHaveLength(2));
    const validate = vi.fn(async () => undefined);

    await act(async () => {
      await result.current.onNext(validate);
    });

    expect(validate).toHaveBeenCalledTimes(1);
    expect(result.current.activeStepIndex).toBe(1);
  });

  it('onNext keeps the step and rejects with the same error when the callback rejects', async () => {
    const { result } = renderHook(() => useWizardContext(), {
      wrapper: TwoSteps,
    });
    await waitFor(() => expect(result.current.steps).toHaveLength(2));
    const failure = new Error('invalid step');
    const validate = vi.fn(() => Promise.reject(failure));
    let caught: unknown;

    await act(async () => {
      try {
        await result.current.onNext(validate);
      } catch (error) {
        caught = error;
      }
    });

    expect(caught).toBe(failure);
    expect(result.current.activeStepIndex).toBe(0);
  });
});
