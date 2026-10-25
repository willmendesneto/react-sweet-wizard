import type { PropsWithChildren, ReactElement } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useWizardContext, WizardProvider, Steps, Step } from '.';

const ThreeSteps = ({ children }: PropsWithChildren) => (
  <WizardProvider>
    <Steps>
      <Step id="0">
        <div>
          <p>step 1</p>
          {children}
        </div>
      </Step>
      <Step id="1">
        <div>
          <p>step 2</p>
          {children}
        </div>
      </Step>
      <Step id="step3">
        <div>
          <p>step 3</p>
          {children}
        </div>
      </Step>
    </Steps>
  </WizardProvider>
);

const renderUseWizardHook = () =>
  renderHook(() => useWizardContext(), { wrapper: ThreeSteps });

// React reports render errors through console.error; silence it only for tests that expect a throw.
const expectRenderToThrow = (render: () => unknown, message: string) => {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  expect(render).toThrow(message);
  spy.mockRestore();
};

describe('useWizard hook', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw an error if hooks is NOT using wizard provider as wrapper', () => {
    expectRenderToThrow(
      () =>
        renderHook(() => useWizardContext(), {
          wrapper: ({ children }: PropsWithChildren) => <div>{children}</div>,
        }),
      `Please make sure you're wrapping all the steps in a 'WizardProvider' component`
    );
  });

  it('should throw an error if Steps component does not receive `Step` as component', () => {
    expectRenderToThrow(
      () =>
        renderHook(() => useWizardContext(), {
          wrapper: ({ children }: PropsWithChildren) => (
            <WizardProvider>
              <Steps>
                <div>{children}</div>
              </Steps>
            </WizardProvider>
          ),
        }),
      `Error at position "0". You should compose Steps using "Step" component`
    );
  });

  it('should throw an error if Steps component does not receive any children', () => {
    expectRenderToThrow(
      () =>
        renderHook(() => useWizardContext(), {
          wrapper: () => (
            <WizardProvider>
              {/* eslint-disable-next-line react/no-children-prop -- forcing the invalid case */}
              <Steps children={undefined as unknown as ReactElement} />
            </WizardProvider>
          ),
        }),
      'Steps should have at least a single child component'
    );
  });

  it('should be available when wrapped in wizard', async () => {
    const { result } = renderUseWizardHook();
    await waitFor(() => expect(result.current.steps).toHaveLength(3));

    expect(result.current).toEqual({
      activeStepIndex: 0,
      steps: [{ id: '0' }, { id: '1' }, { id: 'step3' }],
      isFirstStep: true,
      isLastStep: false,
      goTo: expect.any(Function),
      onNext: expect.any(Function),
      onPrevious: expect.any(Function),
      setSteps: expect.any(Function),
      getActiveStep: expect.any(Function),
    });
  });

  it('call should be called if passed on `onNext`', async () => {
    const { result } = renderUseWizardHook();
    const handleNext = vi.fn();

    await act(async () => {
      await result.current.onNext(handleNext);
    });

    expect(result.current.activeStepIndex).toBe(1);
    expect(handleNext).toHaveBeenCalledTimes(1);
  });

  it('should not break if user goes above or below available steps', async () => {
    const { result } = renderUseWizardHook();
    expect(result.current.activeStepIndex).toBe(0);

    await act(async () => {
      result.current.onNext();
      result.current.onNext();
      result.current.onNext();
    });

    expect(result.current.activeStepIndex).toBe(2);

    act(() => {
      result.current.onPrevious();
      result.current.onPrevious();
      result.current.onPrevious();
    });

    expect(result.current.activeStepIndex).toBe(0);
  });

  it('should move between steps if `goTo` method is called with number', () => {
    const { result } = renderUseWizardHook();
    expect(result.current.activeStepIndex).toBe(0);

    act(() => {
      result.current.goTo(1);
    });

    expect(result.current.activeStepIndex).toBe(1);

    act(() => {
      result.current.goTo(0);
    });

    expect(result.current.activeStepIndex).toBe(0);
  });

  it('should move between steps if `goTo` method is called with string', () => {
    const { result } = renderUseWizardHook();
    expect(result.current.activeStepIndex).toBe(0);

    act(() => {
      result.current.goTo('step3');
    });

    expect(result.current.activeStepIndex).toBe(2);

    act(() => {
      result.current.goTo(0);
    });

    expect(result.current.activeStepIndex).toBe(0);
  });

  it('should return the active step mapped object if calling `getActiveStep` method', () => {
    const { result } = renderUseWizardHook();

    expect(result.current.activeStepIndex).toBe(0);
    expect(result.current.getActiveStep()).toEqual({ id: '0' });
  });

  it('should update steps with mapped object if `setSteps` is called', () => {
    const { result } = renderUseWizardHook();
    const mockedSteps = [
      { id: '0', test: true },
      { id: '1', test: false },
      { id: 'step3', test: true },
    ];

    act(() => {
      result.current.setSteps(mockedSteps);
    });

    expect(result.current.activeStepIndex).toBe(0);
    expect(result.current.getActiveStep()).toEqual(mockedSteps[0]);
    expect(result.current.steps).toEqual(mockedSteps);
  });
});
