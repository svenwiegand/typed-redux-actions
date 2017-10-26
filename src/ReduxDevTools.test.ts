import { reduxDevToolsEnhancer } from '.';

describe('reduxDevToolsEnhancer', () => {
    it('must return undefined if devtools are not installed', () => {
        const enhancer = reduxDevToolsEnhancer<{}>();
        expect(enhancer).toBeUndefined();
    });

    it('must return an enhancer if devtools are installed', () => {
        const storeEnhancerStoreCreator = {};
        const enhancer = jest.fn(() => storeEnhancerStoreCreator);
        /* tslint:disable-next-line */
        const scope: any = window;
        /* istanbul ignore next */
        scope.__REDUX_DEVTOOLS_EXTENSION__ = enhancer;
        expect(reduxDevToolsEnhancer()).toBe(storeEnhancerStoreCreator);
    });
});