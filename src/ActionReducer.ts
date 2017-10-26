import * as Redux from 'redux';

export type ActionTypeEnum = {}

export interface BaseAction extends Redux.Action {
    readonly type: {}
}

export interface ActionDeclaration<Action extends BaseAction> {
    readonly type: Action['type'];
    readonly action: Action
}

/* tslint:disable-next-line */
export function declareAction<Action extends BaseAction>(create: (...args: any[]) => Action): ActionDeclaration<Action> {
    return {
        type: {} as Action['type'],
        action: {} as Action,
    }
}

export class ActionFilter<Action extends BaseAction> {
    private readonly typeNames: Set<string>;

    constructor(types: ActionTypeEnum, readonly action: Action) {
        this.typeNames = new Set(Object.keys(types).map(key => types[key]));
    }

    matches(action: Redux.AnyAction): action is Action {
        return this.typeNames.has(action.type);
    }
}

export function actionFilter<Declarations extends ActionDeclaration<BaseAction>[]>(
    types: ActionTypeEnum,
    declarations: Declarations): ActionFilter<Declarations[number]['action']> {

    return new ActionFilter(types, {} as Declarations[number]['action']);
}

export class ActionReducer<State, Action extends BaseAction> {
    constructor(private filter: ActionFilter<Action>, readonly initialState: State,
                private reduceAction: (state: State, action: Action) => State) {
    }

    readonly reduce = (state: State, action: Redux.AnyAction) => {
        if (this.filter.matches(action)) {
            return this.reduceAction(state, action);
        } else {
            return state;
        }
    }
}