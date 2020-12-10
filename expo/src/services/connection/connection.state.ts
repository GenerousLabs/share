import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { ConnectionInRedux } from "../../shared.types";
import { selectAllRepos } from "../repo/repo.state";
import { RootState } from "../store/store.service";

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

export const {
  selectAll: selectAllConnections,
  selectById: selectConnectionById,
} = connectionAdapter.getSelectors((state: RootState) => state[REDUCER_KEY]);
export const makeSelectConnectionById = (id: string) => (state: RootState) =>
  selectConnectionById(state, id);
export const makeSelectConnectionAndRepoById = (connectionId: string) =>
  createSelector(
    (state: RootState) => selectConnectionById(state, connectionId),
    selectAllRepos,
    (connection, repos) => {
      const repo = repos.find((r) => r.id === connection?.myRepoId);
      return { connection, repo };
    }
  );
