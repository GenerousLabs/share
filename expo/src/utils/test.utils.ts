import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { Volume } from "memfs";
import mockStore from "redux-mock-store";
import reducer from "../services/store/root.reducer";
import { RepoType } from "../shared.constants";
import { FS } from "../shared.types";
import { RootDispatch, RootState } from "../store";

const preloadedState: RootState = {
  _persist: {
    rehydrated: true,
    version: 1,
  },
  connection: {
    connections: {
      ids: [],
      entities: {},
    },
    repoShares: {
      ids: [],
      entities: {},
    },
    meta: {
      name: "",
    },
  },
  library: {
    filters: { tags: [] },
    offers: {
      ids: [],
      entities: {},
    },
  },
  postoffice: {
    ids: [],
    entities: {},
  },
  repo: {
    ids: ["repo1"],
    entities: {
      repo1: {
        id: "uuid-example-repo",
        uuid: "uuid-example-repo",
        type: RepoType.library,
        title: "An example repo",
        name: "My own name",
        bodyMarkdown: "This is a fake repo",
        headCommitObjectId: "",
        lastFetchTimestamp: 0,
        isReadOnly: false,
        remoteUrl: "",
      },
    },
  },
  setup: {
    isSetupComplete: true,
  },
};

export const getEmptyFilesystem = () => {
  return (Volume.fromJSON({
    "/repo1/": null,
  }) as unknown) as FS & {
    toJSON: () => {};
  };
};

export const getMockStore = () => {
  const middlewares = getDefaultMiddleware();
  return mockStore<RootState, RootDispatch>(middlewares)(preloadedState);
};

export const getEmptyStore = () => {
  return configureStore({
    reducer,
    preloadedState: preloadedState,
  });
};
