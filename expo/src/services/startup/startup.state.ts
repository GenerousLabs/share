import { createAction, createSlice } from "@reduxjs/toolkit";

export const REDUCER_KEY = "startup";

const slice = createSlice({
  name: "SHARE/startup",
  initialState: {
    splashScreenHidden: false,
  },
  reducers: {
    splashScreenHasBeenHidden: (state) => {
      state.splashScreenHidden = true;
    },
  },
});

export const { splashScreenHasBeenHidden } = slice.actions;

export default slice.reducer;

/**
 * This action gets dispatched on application boot.
 */
export const maybeStartupSagaAction = createAction("SHARE/maybeStartup");

/**
 * This action gets dispatched once the application is ready to boot.
 */
export const startupSagaAction = createAction("SHARE/startup");
