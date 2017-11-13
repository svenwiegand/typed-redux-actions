import { createStoreWithDevTools } from '.';
import { createStore } from 'redux';

describe('createStoreWithDevTools', () => {
    it('resolves to createStore if devtools are not installed', () => {
        expect(createStoreWithDevTools).toBe(createStore);
    });
});