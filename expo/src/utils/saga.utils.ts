import { createPromiseAction, PromiseAction } from "redux-saga-promise-actions";
import * as effectCreators from "redux-saga-promise-actions/effects";
import { ForkEffect } from "redux-saga/effects";
import { SagaGenerator } from "typed-redux-saga/macro";
// NOTE: This is not specified as a dependency, it's a dependency of
// `redux-saga-promise-actions` and only imported for types.
import { TypeConstant } from "typesafe-actions";

export type TakeEffectType = keyof typeof effectCreators;

export const createAsyncPromiseSaga = <P, R>({
  prefix,
  effect,
  takeType = "takeEveryPromiseAction",
}: {
  prefix: TypeConstant;
  effect: (action: PromiseAction<TypeConstant, P, R>) => SagaGenerator<R>;
  takeType?: TakeEffectType;
}) => {
  const actionCreators = createPromiseAction(
    `${prefix}/request`,
    `${prefix}/success`,
    `${prefix}/failure`
  )<P, R, { error: Error }>();

  const { request, success, failure } = actionCreators;

  const takeEffect = effectCreators[takeType];

  function* saga(): SagaGenerator<void, ForkEffect<R>> {
    yield takeEffect(actionCreators, effect);
  }

  return {
    request,
    success,
    failure,
    saga,
  };
};
