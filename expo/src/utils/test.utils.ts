import {
  configureStore,
  createStore,
  ThunkAction,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import { Volume } from "memfs";
import reducer from "../root.reducer";
import { FS } from "../shared.types";
import mockStore from "redux-mock-store";
import { getDefaultMiddleware } from "@reduxjs/toolkit";
import { RootDispatch, RootState } from "../store";
import thunk from "@reduxjs/toolkit";
import { Library } from "../services/library/library.state";

export const getEmptyFilesystem = () => {
  return (Volume.fromJSON({
    "/repo1/": null,
  }) as unknown) as FS & {
    toJSON: () => {};
  };
};

export const getMockStore = () => {
  const middlewares = getDefaultMiddleware();
  return mockStore<RootState, RootDispatch>(middlewares)({
    repo: {
      ids: ["repo1"],
      entities: {
        repo1: {
          repoId: "repo1",
          uuid: "uuid-example-repo",
          title: "An example repo",
          descriptionMarkdown: "This is a fake repo",
          path: "/repo1/",
          headCommitObjectId: "",
          lastFetchTimestamp: 0,
        },
      },
    },
    library: {
      ids: [],
      entities: {},
    },
  });
};

export const getEmptyStore = () => {
  return configureStore({
    reducer,
    preloadedState: {
      repo: {
        ids: ["repo1"],
        entities: {
          repo1: {
            repoId: "repo1",
            path: "/repo1/",
            headCommitObjectId: "",
            lastFetchTimestamp: 0,
          },
        },
      },
    },
  });
};
