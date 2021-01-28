import { createAction, createSlice } from "@reduxjs/toolkit";
import { makeErrorActionCreator } from "../../utils/errors.utils";
import { Config } from "../config/config.service";

export const REDUCER_KEY = "setup" as const;

type State = {
  /** Has the application finished its first time setup? */
  isSetupComplete: boolean;
  /** Did setup fail? */
  didSetupFail?: boolean;
  setupError?: Error;
};

const initialState: State = { isSetupComplete: false };

const SETUP = "SHARE/setup/setup";
export const setupSagaAction = createAction<{ config: Config }>(SETUP);
export const setupErrorAction = makeErrorActionCreator(SETUP);

const setupSlice = createSlice({
  name: "SHARE/setup",
  initialState,
  reducers: {
    setSetupCompleteAction: (state) => {
      state.isSetupComplete = true;
      state.didSetupFail = false;
      state.setupError = undefined;
    },
  },
  extraReducers: {
    [setupErrorAction.toString()]: (state, action) => {
      state.didSetupFail = true;
      state.setupError = action.payload.error;
    },
  },
});

export const { setSetupCompleteAction } = setupSlice.actions;

export default setupSlice.reducer;

/**
 * This action triggers a complete reset of the application. It is *extremely*
 * destructive.
 */
export const DANGEROUS_setupResetSagaAction = createAction("SHARE/setup/reset");
