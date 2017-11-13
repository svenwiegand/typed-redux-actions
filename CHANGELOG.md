# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.0.0"></a>
# [2.0.0](https://github.com/svenwiegand/typed-redux-actions/compare/v1.2.1...v2.0.0) (2017-11-13)


### Features

* Replaced `reduxDevToolsEnhancer` with `createStoreWithDevTools` to make this work together with i.e. redux-thunk. ([559ceab](https://github.com/svenwiegand/typed-redux-actions/commit/559ceab))


### BREAKING CHANGES

* `reduxDevToolsEnhancer` is no longer available. Instead use `createStoreWithDevTools` to create your store.



<a name="1.2.1"></a>
## [1.2.1](https://github.com/svenwiegand/typed-redux-actions/compare/v1.2.0...v1.2.1) (2017-11-09)


### Bug Fixes

* Fix `this`-context for reducer *and* keep `undefined` option for state parameter. ([8c2d7e7](https://github.com/svenwiegand/typed-redux-actions/commit/8c2d7e7))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/svenwiegand/typed-redux-actions/compare/v1.1.1...v1.2.0) (2017-11-09)


### Bug Fixes

* Fix reducer's type declaration to allow undefined state parameter. ([7d990ad](https://github.com/svenwiegand/typed-redux-actions/commit/7d990ad))


### Features

* Run coverage when building release and remember about uncommitted files. ([d202083](https://github.com/svenwiegand/typed-redux-actions/commit/d202083))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/svenwiegand/typed-redux-actions/compare/v1.1.0...v1.1.1) (2017-11-09)


### Bug Fixes

* Following redux convention to return initial state when undefined state is provided to the reducer. ([99709b9](https://github.com/svenwiegand/typed-redux-actions/commit/99709b9))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/svenwiegand/typed-redux-actions/compare/v1.0.1...v1.1.0) (2017-10-27)


### Features

* Added API documentation ([f29f60c](https://github.com/svenwiegand/typed-redux-actions/commit/f29f60c))



<a name="1.0.1"></a>
## 1.0.1 (2017-10-27)
- Initial release
