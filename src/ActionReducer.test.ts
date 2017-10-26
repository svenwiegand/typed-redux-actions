import { actionFilter, ActionReducer, declareAction } from '.';

enum ActionType {
    increment = 'INCREMENT',
    reset = 'RESET'
}

function createIncrement(increment: number) {
    return {
        type: ActionType.increment as typeof ActionType.increment,
        increment: increment
    };
}

function createReset() {
    return {
        type: ActionType.reset as typeof ActionType.reset
    }
}

const filter = actionFilter(ActionType, [
    declareAction(createIncrement),
    declareAction(createReset)
]);

const reducer = new ActionReducer(filter, 0, (state: number, action: typeof filter.action) => {
    switch (action.type) {
        case ActionType.increment: return state + action.increment;
        case ActionType.reset: return 0;
    }
});

describe('ActionReducer', () => {
    it('implicitly infers all action types and provides union action type', () => {
        // successful if typescript compiles without errors and nothing is 'red' in this file
    });

    it('processes known actions', () => {
        const newState = reducer.reduce(0, createIncrement(2));
        expect(newState).toBe(2);
        expect(reducer.reduce(newState, createReset())).toBe(0);
    });

    it('returns the provided state for unknown actions', () => {
        const state = 42;
        expect(reducer.reduce(state, { type: 'unknown' })).toBe(state);
    });
});