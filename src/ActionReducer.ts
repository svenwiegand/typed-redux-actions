import * as Redux from 'redux';

/**
 * Type of the `enum` specifying the possible action `type`s.
 *
 * **Example:**
 * ```typescript
 * enum ActionType {
 *   set = 'SET_COUNTER',
 *   increment = 'INCREMENT_COUNTER'
 * }
 * ```
 */
export type ActionTypeEnum = {}

/**
 * Base type for all actions. It is compatible with `Redux.Action` but makes the `type` readonly.
 */
export interface BaseAction extends Redux.Action {
    readonly type: {}
}

/**
 * Action with an undefined type. Especially helpful for initialization and testing.
 */
export const undefinedAction: BaseAction = { type: {} };

/**
 * Describes the types of an action.
 */
export interface ActionDeclaration<Action extends BaseAction> {
    /** The literal type of the action's `type` property */
    readonly type: Action['type'];

    /** The type of the action object as returned from the action creator */
    readonly action: Action
}

/**
 * Creates an [[ActionDeclaration]] for the specified action creator. An [[ActionDeclaration]] provides type information
 * for the action object returned by an action creator.
 *
 * @param create the action creator function
 * @return the [[ActionDeclaration]] providing type information for the action object provided by the creator.
 */
export function declareAction<Action extends BaseAction>(
    /* tslint:disable */create: (...args: any[]) => Action): ActionDeclaration<Action> {/* tslint:enable */
    return {
        type: {} as Action['type'],
        action: {} as Action,
    }
}

/**
 * Provides a custom [typeguard](https://www.typescriptlang.org/docs/handbook/advanced-types.html) to check whether
 * a provided action is one that matches the provided actions (and implicitly cast to it).
 *
 * Use the [[actionFilter]] function to create a filter for a list of actions.
 */
export interface ActionFilter<Action extends BaseAction> {
    /**
     * A dummy object of the union type of all action objects supported by this filter.
     * When you need the type use `typeof filter.action`.
     */
    readonly action: Action;

    /**
     * Typeguard that checks whether the provided action is one of the actions supported by this filter.
     * @param action the action to check
     * @returns typeguard
     */
    matches(action: Redux.AnyAction): action is Action;
}

class ActionFilterImpl<Action extends BaseAction> implements ActionFilter<Action> {
    private readonly typeNames: Set<string>;

    constructor(types: ActionTypeEnum, readonly action: Action) {
        this.typeNames = new Set(Object.keys(types).map(key => types[key]));
    }

    matches(action: Redux.AnyAction): action is Action {
        return this.typeNames.has(action.type);
    }
}

/**
 * Creates an [[ActionFilter]] for the specified [[ActionTypeEnum]] and [[ActionDeclaration]]s.
 *
 * **Example:**
 * ```typescript
 * actionFilter(ActionType, [declareAction(setCounter), declareAction(incrementCounter)]);
 * ```
 *
 * @param types the `enum` specifying the possible values for the `type` properties of the actions supported by this
 *     filter
 * @param declarations list of [[ActionDeclaration]]s of the actions supported by this filter.
 * @returns the resulting [[ActionFilter]]
 */
export function actionFilter<Declarations extends ActionDeclaration<BaseAction>[]>(
    types: ActionTypeEnum,
    declarations: Declarations): ActionFilter<Declarations[number]['action']> {

    return new ActionFilterImpl(types, {} as Declarations[number]['action']);
}

/**
 * A reducer able to handle actions of the specified type. Its [[reduce]] method conforms to Redux's expectation of a
 * reducer.
 */
export class ActionReducer<State, Action extends BaseAction> {
    /**
     * Create a reducer.
     * @param filter the [[ActionFilter]] specifying the actions supported by this reducer.
     * @param initialState the initial state for this reducer. Only used for state type inference.
     * @param reduceAction the reducer function for the specified action type. Only actions matching the `filter` will
     *     be provided to this reducer function.
     */
    constructor(private filter: ActionFilter<Action>, readonly initialState: State,
                private reduceAction: (state: State, action: Action) => State) {
    }

    /**
     * A reducer function matching Redux's expectation of a reducer. It will forward messages matching this reducer's
     * [[ActionFilter]] to the reducer function specified in the constructor and return the provided `state` for each
     * other action.
     * @param state the state to reduce
     * @param action the action to apply to the state
     * @returns the initial state if `state` is undefined or the resulting state if the `action` is supported by this
     *     reducer's [[ActionFilter]] or `state` otherwise.
     */
    reduce(state: State | undefined, action: Redux.AnyAction): State {
        if (typeof state === 'undefined') {
            return this.initialState;
        } else if (this.filter.matches(action)) {
            return this.reduceAction(state, action);
        } else {
            return state;
        }
    }
}