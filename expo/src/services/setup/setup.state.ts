import { createAction, createSlice } from "@reduxjs/toolkit";
import { makeErrorActionCreator } from "../../utils/errors.utils";
import { Config } from "../config/config.service";

export const REDUCER_KEY = "setup" as const;

type State = {
  /** Has the application finished its first time setup? */
  isSetupComplete: boolean;
  /** Did setup fail? */
  didSetupFailed?: boolean;
};

const initialState: State = { isSetupComplete: false };

const setupSlice = createSlice({
  name: "SHARE/setup",
  initialState,
  reducers: {
    setSetupComplete: (state) => {
      state.isSetupComplete = true;
    },
  },
  extraReducers: {
    setupErrorAction: (state) => {
      state.didSetupFailed = true;
    },
  },
});

export const { setSetupComplete } = setupSlice.actions;

export default setupSlice.reducer;

const SETUP = "SHARE/setup/setup";
export const setupSagaAction = createAction<{ config: Config }>(SETUP);
export const setupErrorAction = makeErrorActionCreator(SETUP);
