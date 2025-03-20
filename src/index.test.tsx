import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { useWizardContext, WizardProvider, Steps, Step } from '.';

// Common render use wizard hook
const renderUseWizardHook = (initialStartIndex = 0) =>
  renderHook(() => useWizardContext(), {
    initialProps: {
      startIndex: initialStartIndex,
    },
    wrapper: ({ children }) => (
      <WizardProvider>
        <Steps>
          <Step key="0" id="0">
            <div>
              <p>step 1</p>
              {children}
            </div>
          </Step>
          <Step key="1" id="1">
            <div>
              <p>step 2</p>
              {children}
            </div>
          </Step>
          <Step key="2" id="step3">
            <div>
              <p>step 3</p>
              {children}
            </div>
          </Step>
        </Steps>
      </WizardProvider>
    ),
  });

describe('useWizard hook', () => {
  afterEach(jest.resetAllMocks);

  it('should throw an error if hooks is NOT using wizard provider as wrapper', () => {
    const { result } = renderHook(() => useWizardContext(), {
      wrapper: props => <div {...props} />,
    });

    expect(result.error).toEqual(
      Error(
        `Please make sure you're wrapping all the steps in a 'WizardProvider' component`
      )
    );
  });

  it('should throw an error if Steps component does not receive `Step` as component', () => {
    const { result } = renderHook(() => useWizardContext(), {
      wrapper: props => (
        <WizardProvider>
          <Steps>
            <div {...props} />
          </Steps>
        </WizardProvider>
      ),
    });

    expect(result.error).toEqual(
      Error(
        `Error at position "0". You should compose Steps using "Step" component`
      )
    );
  });

  it('should throw an error if Steps component does not receive any children', () => {
    const { result } = renderHook(() => useWizardContext(), {
      wrapper: () => (
        <WizardProvider>
          {/* eslint-disable-next-line react/no-children-prop */}
          <Steps children={undefined as any} />
        </WizardProvider>
      ),
    });

    expect(result.error).toEqual(
      Error(`Steps should have at least a single child component`)
    );
  });

  it('should be available when wrapped in wizard', () => {
    const { result } = renderUseWizardHook();
    expect(result.current).toBeDefined();
    expect(result.current).toEqual({
      activeStepIndex: result.current.activeStepIndex,
      steps: result.current.steps,
      isFirstStep: result.current.isFirstStep,
      isLastStep: result.current.isLastStep,
      goTo: expect.any(Function),
      onNext: expect.any(Function),
      onPrevious: expect.any(Function),
      setSteps: expect.any(Function),
      getActiveStep: expect.any(Function),
    });
  });

  it('call should be called if passed on `onNext`', async () => {
    const { result, waitFor } = renderUseWizardHook();
    expect(result.current).toBeDefined();

    const handleNext = jest.fn();
    act(() => {
      result.current.onNext(handleNext);
    });

    await waitFor(() => {
      expect(result.current.activeStepIndex).toBe(1);
    });
  });

  it('should not break if user goes above or below available steps', () => {
    const { result } = renderUseWizardHook();
    expect(result.current).toBeDefined();
    expect(result.current.activeStepIndex).toBe(0);

    act(() => {
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
    expect(result.current).toBeDefined();
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
    expect(result.current).toBeDefined();
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
    expect(result.current).toBeDefined();
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
