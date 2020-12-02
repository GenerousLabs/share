import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import reducer from "./root.reducer";
import rootSaga from "./root.saga";
import { maybeStartupSagaAction } from "./services/startup/startup.state";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleWare) => [
    ...getDefaultMiddleWare({
      // thunk: false,
    }),
    sagaMiddleware,
  ],
});

sagaMiddleware.run(rootSaga);

store.dispatch(maybeStartupSagaAction());

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
// This type is a helper to pass to the 3rd generic type of
// `createAsyncThunk()`, see docs:
// https://redux-toolkit.js.org/usage/usage-with-typescript/#createasyncthunk
export type RootThunkApi = {
  state: RootState;
  dispatch: RootDispatch;
};
