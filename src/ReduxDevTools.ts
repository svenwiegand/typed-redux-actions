import { StoreEnhancer, StoreEnhancerStoreCreator } from 'redux';

interface WindowWithReduxDevTools<State> {
    __REDUX_DEVTOOLS_EXTENSION__: StoreEnhancer<State>;
}

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