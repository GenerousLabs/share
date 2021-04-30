import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import Constants from "expo-constants";
import { Alert } from "react-native";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import createSagaMiddleware from "redux-saga";
import { promiseMiddleware } from "redux-saga-promise-actions";
import { CONFIG } from "../../shared.constants";
import { rootLogger } from "../log/log.service";
import { maybeStartupSagaAction } from "../startup/startup.state";
import reducer from "./root.reducer";
import rootSaga from "./root.saga";
import { persistConfig } from "./store.config";

const log = rootLogger.extend("store");

const persistedReducer = persistReducer(persistConfig, reducer);

const sagaMonitorLogFactory = (name: string) => (p: any) =>
  log.debug(`SagaMonitor.${name} #Ub3D0G`, p);

const sagaOptions =
  __DEV__ && CONFIG.logSagas
    ? {
        sagaMonitor: {
          actionDispatched: sagaMonitorLogFactory("actionDispatched"),
          effectTriggered: sagaMonitorLogFactory("effectTriggered"),
          effectResolved: sagaMonitorLogFactory("effectResolved"),
          effectCancelled: sagaMonitorLogFactory("effectCancelled"),
          effectRejected: sagaMonitorLogFactory("effectRejected"),
        },
      }
    : undefined;

const sagaMiddleware = createSagaMiddleware(sagaOptions);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare({
      thunk: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ["meta.promise"],
      },
    }).prepend(promiseMiddleware, sagaMiddleware),
});

export const persistor = persistStore(store);

export const startSagas = () => {
  try {
    sagaMiddleware.run(rootSaga);

    store.dispatch(maybeStartupSagaAction());
  } catch (error) {
    console.error("startSagas() caught error #7u3TOB", error);
    Alert.alert(
      "Fatal error",
      `Sorry, something has gone wrong, and we don't have a good suggestion for you. :-( If you see this again, or get stuck here, please contact us on the telegram group.`
    );
  }
};

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
