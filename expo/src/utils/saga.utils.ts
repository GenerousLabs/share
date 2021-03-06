import {
  createPromiseAction,
  PromiseAction,
  rejectPromiseAction,
  resolvePromiseAction,
} from "redux-saga-promise-actions";
import {
  put,
  take,
  takeEvery,
  takeLatest,
  takeLeading,
} from "redux-saga/effects";
import { actionChannel, call, SagaGenerator } from "typed-redux-saga/macro";
// NOTE: This is not specified as a dependency, it's a dependency of
// `redux-saga-promise-actions` and only imported for types.
import { TypeConstant } from "typesafe-actions";
import { rootLogger } from "../services/log/log.service";
import { getSerializableError } from "./errors.utils";

const effectCreators = { takeEvery, takeLatest, takeLeading };

export type TakeEffectType = keyof typeof effectCreators;

const log = rootLogger.extend("saga.utils");

export const createAsyncPromiseSaga = <P, R>({
  prefix,
  effect,
  takeType = "takeEvery",
  useChannel = false,
}: {
  prefix: TypeConstant;
  effect: (action: PromiseAction<TypeConstant, P, R>) => SagaGenerator<R>;
  takeType?: TakeEffectType;
  useChannel?: boolean;
}) => {
  const { request, success, failure } = createPromiseAction(
    `${prefix}/request`,
    `${prefix}/success`,
    `${prefix}/failure`
  )<P, R, { error: Error }>();

  const takeEffect = effectCreators[takeType];

  function* sagaWrapper(action: ReturnType<typeof request>) {
    try {
      const response = yield* call(effect, action);

      try {
        resolvePromiseAction(action, response);
      } catch (error) {
        // QUESTION Is there a better way to handle errors here?
        log.error("Error resolving promise action #Kfygxz", {
          error,
          action,
          response,
        });
      }
      try {
        yield put(success(response));
      } catch (error) {
        // QUESTION Is there a better way to handle errors here?
        log.error("Error dispatching promise action success #6QX52P", {
          error,
          action,
          response,
        });
      }
    } catch (error) {
      const serializableError = getSerializableError(error);
      log.debug("saga error #QXYogF", { error, serializableError, action });
      yield put(failure({ error: getSerializableError(error) }));
      yield rejectPromiseAction(action, error);
    }
  }

  const saga = useChannel
    ? function* sagaChannel() {
        const channel = yield* actionChannel(request.toString());

        while (true) {
          const action: PromiseAction<TypeConstant, P, R> = yield take(channel);
          yield* call(sagaWrapper, action);
        }
      }
    : function* saga() {
        yield takeEffect(request.toString(), sagaWrapper);
      };

  return {
    request,
    success,
    failure,
    saga,
    effect,
  };
};

export type ExtractPromiseResolveType<T = PromiseAction<any, any, any>> =
  T extends PromiseAction<any, any, infer R> ? R : never;

/**
 * This is a bit of a headache, but I can't figure out how to get all the types
 * to play nicely together. Once the typing issue is solved, we can remove all
 * of the calls to this.
 */
export const getAsyncPromiseResolveValue = <
  T extends PromiseAction<any, any, any>
>(
  resolved: T
) => resolved as ExtractPromiseResolveType<T>;
