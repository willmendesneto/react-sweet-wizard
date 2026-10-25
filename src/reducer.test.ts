import { describe, expect, it } from 'vitest';
import { initialState, reducer } from './reducer';
import type { Action, DefaultWizardStepProps, WizardState } from './types';

const steps: DefaultWizardStepProps[] = [{ id: 0 }, { id: 1 }, { id: 'step3' }];

const at = (activeStepIndex: number): WizardState<DefaultWizardStepProps> => ({
  activeStepIndex,
  steps,
});

describe('reducer', () => {
  it('starts on the first step with no registered steps', () => {
    expect(initialState()).toEqual({ activeStepIndex: 0, steps: [] });
  });

  it('NEXT_PAGE moves forward by one step', () => {
    expect(reducer(at(0), { type: 'NEXT_PAGE' })).toEqual(at(1));
  });

  it('NEXT_PAGE on the last step returns the same state', () => {
    const state = at(2);

    expect(reducer(state, { type: 'NEXT_PAGE' })).toBe(state);
  });

  it('PREV_PAGE moves back by one step', () => {
    expect(reducer(at(2), { type: 'PREV_PAGE' })).toEqual(at(1));
  });

  it('PREV_PAGE on the first step returns the same state', () => {
    const state = at(0);

    expect(reducer(state, { type: 'PREV_PAGE' })).toBe(state);
  });

  it('GOTO_PAGE with a number treats it as an index', () => {
    expect(
      reducer(at(0), { type: 'GOTO_PAGE', payload: { stepId: 2 } })
    ).toEqual(at(2));
  });

  it('GOTO_PAGE with a string matches the step id', () => {
    expect(
      reducer(at(0), { type: 'GOTO_PAGE', payload: { stepId: 'step3' } })
    ).toEqual(at(2));
  });

  it('GOTO_PAGE with an unknown index or id returns the same state', () => {
    const state = at(0);

    expect(reducer(state, { type: 'GOTO_PAGE', payload: { stepId: 5 } })).toBe(
      state
    );
    expect(
      reducer(state, { type: 'GOTO_PAGE', payload: { stepId: 'missing' } })
    ).toBe(state);
  });

  it('GOTO_PAGE to the active step returns the same state', () => {
    const state = at(1);

    expect(reducer(state, { type: 'GOTO_PAGE', payload: { stepId: 1 } })).toBe(
      state
    );
  });

  it('SET_STEP_COUNT replaces the steps and keeps the index', () => {
    const next = [{ id: 'a' }, { id: 'b' }];

    expect(
      reducer(at(1), { type: 'SET_STEP_COUNT', payload: { steps: next } })
    ).toEqual({ activeStepIndex: 1, steps: next });
  });

  it('GOTO_PAGE with a string also matches a numeric id', () => {
    const numeric = { activeStepIndex: 0, steps: [{ id: 10 }, { id: 20 }] };

    expect(
      reducer(numeric, { type: 'GOTO_PAGE', payload: { stepId: '20' } })
    ).toEqual({ ...numeric, activeStepIndex: 1 });
  });

  it('SET_STEP_COUNT clamps the index when steps are removed', () => {
    expect(
      reducer(at(2), {
        type: 'SET_STEP_COUNT',
        payload: { steps: [{ id: 0 }] },
      })
    ).toEqual({ activeStepIndex: 0, steps: [{ id: 0 }] });
  });

  it('REGISTER_STEP_IDS keeps the current steps when the ids match as strings', () => {
    const named = { activeStepIndex: 0, steps: [{ id: '0', name: 'a' }] };

    expect(
      reducer(named, { type: 'REGISTER_STEP_IDS', payload: { ids: [0] } })
    ).toBe(named);
  });

  it('REGISTER_STEP_IDS replaces the steps when an id differs', () => {
    expect(
      reducer(at(0), {
        type: 'REGISTER_STEP_IDS',
        payload: { ids: [0, 'x', 'step3'] },
      })
    ).toEqual({
      activeStepIndex: 0,
      steps: [{ id: 0 }, { id: 'x' }, { id: 'step3' }],
    });
  });

  it('REGISTER_STEP_IDS registers a single empty-string id', () => {
    expect(
      reducer(initialState(), {
        type: 'REGISTER_STEP_IDS',
        payload: { ids: [''] },
      })
    ).toEqual({ activeStepIndex: 0, steps: [{ id: '' }] });
  });

  it('REGISTER_STEP_IDS clamps the index when steps are removed', () => {
    expect(
      reducer(at(2), { type: 'REGISTER_STEP_IDS', payload: { ids: [0, 1] } })
    ).toEqual({ activeStepIndex: 1, steps: [{ id: 0 }, { id: 1 }] });
  });

  it('ignores an unknown action', () => {
    const state = at(0);
    const unknown = {
      type: 'UNKNOWN',
    } as unknown as Action<DefaultWizardStepProps>;

    expect(reducer(state, unknown)).toBe(state);
  });
});
