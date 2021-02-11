import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { makeErrorActionCreator } from "../../utils/errors.utils";

export const REDUCER_KEY = "setup" as const;

type RemoteParams = {
  protocol: string;
  host: string;
  username: string;
  token: string;
};
type State = {
  /** Has the application finished its first time setup? */
  isSetupComplete: boolean;
  /** Did setup fail? */
  didSetupFail?: boolean;
  setupError?: Error;
  remoteParams?: RemoteParams;
  name?: string;
  inviteCodes: string[];
};

const initialState: State = { isSetupComplete: false, inviteCodes: [] };

const SETUP = "SHARE/setup/setup";
export const setupSagaAction = createAction(SETUP);
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
    setName: (state, action: PayloadAction<{ name: string }>) => {
      state.name = action.payload.name;
    },
    setRemoteParams: (state, action: PayloadAction<RemoteParams>) => {
      state.remoteParams = action.payload;
    },
    addInviteCode: (state, action: PayloadAction<{ inviteCode: string }>) => {
      if (state.inviteCodes.indexOf(action.payload.inviteCode) === -1) {
        state.inviteCodes.push(action.payload.inviteCode);
      }
    },
    removeInviteCode: (
      state,
      action: PayloadAction<{ inviteCode: string }>
    ) => {
      state.inviteCodes = state.inviteCodes.filter(
        (code) => code !== action.payload.inviteCode
      );
    },
    clearInviteCodes: (state) => {
      state.inviteCodes = [];
    },
  },
  extraReducers: {
    [setupErrorAction.toString()]: (state, action) => {
      state.didSetupFail = true;
      state.setupError = action.payload.error;
    },
  },
});

export const {
  setSetupCompleteAction,
  setName,
  setRemoteParams,
  addInviteCode,
  removeInviteCode,
  clearInviteCodes,
} = setupSlice.actions;

export default setupSlice.reducer;

/**
 * This action triggers a complete reset of the application. It is *extremely*
 * destructive.
 */
export const DANGEROUS_setupResetSagaAction = createAction("SHARE/setup/reset");
