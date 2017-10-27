[![npm version](https://badge.fury.io/js/typed-redux-actions.svg)](https://badge.fury.io/js/typed-redux-actions) [![Build Status](https://travis-ci.org/svenwiegand/typed-redux-actions.svg?branch=master)](https://travis-ci.org/svenwiegand/typed-redux-actions) [![Coverage Status](https://coveralls.io/repos/github/svenwiegand/typed-redux-actions/badge.svg?branch=master)](https://coveralls.io/github/svenwiegand/typed-redux-actions?branch=master)

# typed-redux-actions
This is a tiny (~60 LOCs) and dependency free (except [Redux](http://redux.js.org/)) [TypeScript](https://www.typescriptlang.org/) library that helps you to concisely specify actions and process them in a typesafe way. This is what you get:

- Concisely specify strongly typed Redux conform actions saving boilerplate code.
- Type safely process these actions in the reducer.
- Let the compiler do a comprehensive check on your reducer to ensure that it handles all actions.

## Motivation
Redux is great and Typescript is great. When used together in conjunction with [discriminated unions](https://www.typescriptlang.org/docs/handbook/advanced-types.html) the compiler will provide us the above mentioned benefits. Unfortunately to get these benefits a lot of boilerplate is necessary.

Here is what you have to do when _not_ using this library.
```typescript
// (1)
enum ActionType {
  set = 'SET',
  increment = 'INCREMENT'
}

// (2)
interface SetAction extends Redux.Action {
  readonly type: typeof ActionType.set;
  readonly value: number;
}

interface IncrementAction extends Redux.Action {
  readonly type: typeof ActionType.increment;
  readonly increment: number;
}

// (3)
type NumberAction = SetAction | IncrementAction;

// (4)
function createSetAction(value: number): SetAction {
  return {
    type: ActionType.set,
    value: value
  }
}

function createIncrementAction(increment: number): IncrementAction {
  return {
    type: ActionType.increment,
    increment: increment
  }
}

// (5)
function reduceNumberAction(state: number, action: NumberAction): number {
  switch(action.type) {
    case ActionType.set: return action.value;
    case ActionType.increment: return state + action.increment;
  }
}

// (6)
function isNumberAction(action: Redux.AnyAction): action is NumberAction {
  return action.type === ActionType.set || action.type === ActionType.increment;
}

function reduce(state: number, action: Redux.AnyAction): number {
  if (isNumberAction(action)) {
    return reduceNumberAction(state, action);
  } else {
    return state;
  }
}
```

Lets dig into this and its boilerplate:

1. The `type` property of an action specifies its type. There are several possibilities how to specify this type, but as we want to work with discriminated unions we need to generate [type literals](https://www.typescriptlang.org/docs/handbook/advanced-types.html). We can do this defining `const`s or using an `enum` like we do it here.
2. Now we define how our available actions look like, so that we can build up a union type in the next step. Notice how we set the types of the `type` properties to the literal types of the adequate `ActionType`.
3. Here we build our union type. As all of the union's types have the `type` property which isn't simply a string, but a type literal, we've set the stage for discriminated unions.
4. Now we need to define the action creator functions. Notice the boilerplate here:
   - we need to specify the whole action structure again
   - we need to specify the `type`-property again though we already did it in the interface declaration
5. Now we can implement our reducer function which only handles our new `NumberAction` type. As we have a discriminated union scenario here, we get the desired benefits:
   - inside the case blocks we can safely access the properties specific to the affected action type without casting.
   - we do _not_ need to specify a `default` block (ensure to disable the [related tslint rule](https://palantir.github.io/tslint/rules/switch-default/)), because the compiler is able to recognize based on the union type whether we handled all possible cases or not.
6. Our job isn't done here, because a Redux reducer must return the original state if it receives an unhandled action. Thus we are defining a function which checks whether an action is of our `NumberAction` type. We then use this function in our final reducer implementation to decide whether to delegate to our specialized reducer or to return the sate.

So when adding a new action we have to do the following:

- Add a new value to the `ActionType` `enum`
- Define the action's type
- Define a creator function which repeats most of the type declaration
- Add the new type to the union of `NumberAction` (easy to forget)
- Add the check of the `type` property to the `isNumberAction` function (easy to forget)
- Add the handling for this action to the reducer (the compiler will remember us to do so)

## Installation
Add _typed-redux-actions_ to your project:
```
npm install --save typed-redux-actions
```

## How to use _typed-redux-actions_
This library provides us some tools to reduce the boilerplate shown above. Lets implment the same solution again:
```typescript
// (1)
enum ActionType {
  set = 'SET',
  increment = 'INCREMENT'
}

// (2)
function createSetAction(value: number): SetAction {
  return {
    type: ActionType.set as typeof ActionType.set,
    value: value
  }
}

function createIncrementAction(increment: number): IncrementAction {
  return {
    type: ActionType.increment as typeof ActionType.increment,
    increment: increment
  }
}

// (3)
const filter = actionFilter(ActionType, [
  declareAction(createSetAction),
  declareAction(createIncrementAction)
]);

// (4)
function reduceNumberAction(state: number, action: typeof filter.action): number {
  switch(action.type) {
    case ActionType.set: return action.value;
    case ActionType.increment: return state + action.increment;
  }
}

// (5)
const reducer = new ActionReducer(filter, 0, reduceNumberAction);
export reducer.reduce
```

Lets see what's going on here and what we save:

1. The definition of the possible action `type` values stays unchanged.
2. Did you notice how we've skipped the whole declaration of the action types and the union type here? **Did you notice?** We're directly declaring our action creators.

   **Notice:** The `ActionType.set as typeof ActionType.set` construct ensures that the `type` property is of the literal type produced by the enum. Alternatively you could use `type: ActionType.set = ActionType.set` or `type = <ActionType.set> ActionType.set`. Use whatever you prefer, but don't leave off the type as `type` will then be of type `string` and our discriminated unions wont work anymore.
3. We now specify our `ActionFilter` by providing our `ActionType` enumeration and our action creators (wrapped in a necessary call to `declareAction`). This is where all the type magic (okay, its only [type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)) happens. The resulting object serves two purposes:
   - it infers the types of the actions from the action creators and provides the resulting union type in its `action` property.
   - its `matches(action: Redux.AnyAction) action is <Action>` method provides a [typeguard](https://www.typescriptlang.org/docs/handbook/advanced-types.html) to check whether an action belongs to our union. This typeguard is used by the `ActionReducer` to decide whether to handle the action or simply return the provided state.
4. Our specialized reducer function looks nearly the same like before. Just notice how we type the `action` parameter with `typeof filter.action` which results in our union type.

   **Note:** Remeber to turn off tslint's [switch-default](https://palantir.github.io/tslint/rules/switch-default/) rule.
5. Here we define our action reducer which automatically forwards to our `reduceNumberAction` for matching action objects. Afterwards we export the reducers `reduce` method which is of type `Redux.Reducer`.

Not only this saved us a lot of initial code. Also lets take a look at what we save when we want to add an action:

- Add a new value to the `ActionType` `enum`
- ~~Define the action's type~~
- Define a creator function ~~which repeats most of the type declaration~~ _which implicitly specifies the action's type_
- ~~Add the new type to the union of `NumberAction` (easy to forget)~~
- ~~Add the check of the `type` property to the `isNumberAction` function (easy to forget)~~
- Add the handling for this action to the reducer (the compiler will remember us to do so)

So we've saved 50% of the necessary steps and all of the steps which are easy to forget. Not bad, huh?

## Bonus
The following has nothing to do with Redux actions but is nevertheless helpful for Redux TypeScript developers: This library provides a `reduxDevToolsEnhancer()` function to initialize your Redux store, so that it uses the [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension) if available in your browser. Use it like this when creating your Redux store:
```typescript
createStore(Reducer, initialState, reduxDevToolsEnhancer());
```
