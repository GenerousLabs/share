import {
  combineReducers,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ConnectionInRedux, RepoShareInRedux } from "../../shared.types";
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
    setPostofficeCode: (
      state,
      action: PayloadAction<{ id: string; code?: string }>
    ) => {
      connectionAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          postofficeCode: action.payload.code,
        },
      });
    },
  },
});

export const {
  addOneConnectionAction,
  updateOneConnectionAction,
  setPostofficeCode,
} = connectionSlice.actions;

const repoShareAdapter = createEntityAdapter<RepoShareInRedux>();

const repoShareSlice = createSlice({
  name: "SHARE/connection/repoShare",
  initialState: repoShareAdapter.getInitialState(),
  reducers: {
    addOneRepoShare: repoShareAdapter.addOne,
  },
});

export const { addOneRepoShare } = repoShareSlice.actions;

const connectionMetaSlice = createSlice({
  name: "SHARE/connection/meta",
  initialState: {
    name: "",
  },
  reducers: {
    setName: (state, action: PayloadAction<{ name: string }>) => {
      state.name = action.payload.name;
    },
  },
});

export const { setName } = connectionMetaSlice.actions;

const connectionReducer = combineReducers({
  connections: connectionSlice.reducer,
  repoShares: repoShareSlice.reducer,
  meta: connectionMetaSlice.reducer,
});

export default connectionReducer;

export const {
  selectAll: selectAllConnections,
  selectById: selectConnectionById,
} = connectionAdapter.getSelectors(
  (state: RootState) => state[REDUCER_KEY].connections
);
export const selectAllConnectionsCount = (state: RootState) =>
  state[REDUCER_KEY].connections.ids.length;
export const makeSelectConnectionById = (id: string) => (state: RootState) =>
  selectConnectionById(state, id);
export const makeSelectConnectionAndRepoById = (connectionId: string) =>
  createSelector(
    [
      (state: RootState) => selectConnectionById(state, connectionId),
      selectAllRepos,
    ],
    (connection, repos) => {
      const repo = repos.find((r) => r.id === connection?.myRepoId);
      return { connection, repo };
    }
  );
export const makeSelectConnectionByReceivedPostofficeCode = (
  receivedPostofficeCode: string
) =>
  createSelector([selectAllConnections], (connections) => {
    return connections.find(
      (connection) =>
        connection.receivedPostofficeCode === receivedPostofficeCode
    );
  });

export const {
  selectAll: selectAllRepoShares,
  selectById: selectRepoShareById,
} = repoShareAdapter.getSelectors(
  (state: RootState) => state[REDUCER_KEY].repoShares
);

export const selectName = (state: RootState) => state[REDUCER_KEY].meta.name;
