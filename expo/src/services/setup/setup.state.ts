import { createAction, createSlice } from "@reduxjs/toolkit";
import { makeErrorActionCreator } from "../../utils/errors.utils";

export const REDUCER_KEY = "setup" as const;

type State = {
  /** Has the application finished its first time setup? */
  setupComplete: boolean;
  /** Did setup fail? */
  setupFailed?: boolean;
};

const initialState: State = { setupComplete: false };

const setupSlice = createSlice({
  name: "SHARE/setup",
  initialState,
  reducers: {
    setSetupComplete: (state) => {
      state.setupComplete = true;
    },
  },
  extraReducers: {
    setupErrorAction: (state) => {
      state.setupFailed = true;
    },
  },
});

export const { setSetupComplete } = setupSlice.actions;

export default setupSlice.reducer;

const SETUP = "SHARE/setup/setup";
export const setupAction = createAction(SETUP);
export const setupErrorAction = makeErrorActionCreator(SETUP);
