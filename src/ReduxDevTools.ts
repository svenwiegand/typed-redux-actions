import { createStore, StoreCreator } from 'redux';

/**
 * Drop-in replacement for Redux's `createStore()` function which will enhance the store using the
 * redux-devtools-extension if installed in your browser.
 */
export const createStoreWithDevTools: StoreCreator =
    /* tslint:disable-next-line */ /* istanbul ignore next */
    window['devToolsExtension'] ? window['devToolsExtension']()(createStore) : createStore;