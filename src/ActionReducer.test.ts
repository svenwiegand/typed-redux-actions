import { actionFilter, ActionReducer, declareAction, undefinedAction } from '.';

enum ActionType {
    increment = 'COUNTER_INCREMENT',
    reset = 'COUNTER_RESET'
}

function incrementCounter(increment: number) {
    return {
        type: ActionType.increment as typeof ActionType.increment,
        increment: increment
    };
}

function resetCounter() {
    return {
        type: ActionType.reset as typeof ActionType.reset
    }
}

const filter = actionFilter(ActionType, [
    declareAction(incrementCounter),
    declareAction(resetCounter)
]);

const initialState = { count: 0 };
type State = typeof initialState;
const reducer = new ActionReducer(filter, { count: 0 }, (state: State, action: typeof filter.action) => {
    switch (action.type) {
        case ActionType.increment: return { count: state.count + action.increment };
        case ActionType.reset: return { count: 0 };
    }
});

describe('ActionReducer', () => {
    it('implicitly infers all action types and provides union action type', () => {
        // successful if typescript compiles without errors and nothing is 'red' in this file
    });

    it('processes known actions', () => {
        const newState = reducer.reduce(initialState, incrementCounter(2));
        expect(newState).toEqual({ count: 2 });
        expect(reducer.reduce(newState, resetCounter())).toEqual(initialState);
    });

    it('returns the provided state for unknown actions', () => {
        const state = { count: 42 };
        expect(reducer.reduce(state, undefinedAction)).toBe(state);
    });

    it('returns the initial state for unknown state', () => {
        const state = reducer.reduce(undefined, incrementCounter(2));
        expect(state).toEqual(initialState);
    });
});