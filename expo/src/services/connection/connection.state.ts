import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { ConnectionInRedux } from "../../shared.types";

export const REDUCER_KEY = "connection" as const;

const connectionAdapter = createEntityAdapter<ConnectionInRedux>();

const connectionSlice = createSlice({
  name: "SHARE/connection",
  initialState: connectionAdapter.getInitialState(),
  reducers: {
    addOneConnectionAction: connectionAdapter.addOne,
    updateOneConnectionAction: connectionAdapter.updateOne,
  },
});

export const {
  addOneConnectionAction,
  updateOneConnectionAction,
} = connectionSlice.actions;

export default connectionSlice.reducer;
