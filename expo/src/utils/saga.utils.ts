import { createPromiseAction, PromiseAction } from "redux-saga-promise-actions";
import * as effectCreators from "redux-saga-promise-actions/dist/effectCreators";
import { SagaGenerator } from "typed-redux-saga/macro";

export type TakeEffectType = keyof typeof effectCreators;

export const createAsyncPromiseSaga = <P, R>({
  prefix,
  effect,
  takeType = "takeEveryPromiseAction",
}: {
  prefix: string;
  effect: (action: PromiseAction<P, R>) => SagaGenerator<R>;
  takeType?: TakeEffectType;
}) => {
  const actionCreators = createPromiseAction(
    `${prefix}/request`,
    `${prefix}/success`,
    `${prefix}/failure`
  )<P, R, { error: Error }>();

  const { request, success, failure } = actionCreators;

  const takeEffect = effectCreators[takeType];

  function* saga() {
    yield takeEffect(request.toString(), effect);
  }

  return {
    request,
    success,
    failure,
    saga,
  };
};
