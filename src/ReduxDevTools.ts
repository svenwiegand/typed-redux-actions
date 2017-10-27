import { StoreEnhancer } from 'redux';

interface WindowWithReduxDevTools<State> {
    __REDUX_DEVTOOLS_EXTENSION__: StoreEnhancer<State>;
}

/**
 * Easily allows you to init the redux-devtools-extension if installed in your browser when creating your Redux store.
 *
 * **Usage:**
 * ```typescript
 * createStore(Reducer, initialState, reduxDevToolsEnhancer());
 * ```
 *
 * @returns the store enhancer that feeds the redux dev tools or `undefined` if the redux devtools are not installed.
 */
export function reduxDevToolsEnhancer<State>(): StoreEnhancer<State> | undefined {
    /* tslint:disable-next-line */
    const scope: any = window;
    /* istanbul ignore next */
    if ((<WindowWithReduxDevTools<State>> scope).__REDUX_DEVTOOLS_EXTENSION__) {
        return scope.__REDUX_DEVTOOLS_EXTENSION__();
    } else {
        return undefined;
    }
}