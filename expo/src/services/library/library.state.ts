import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export const REDUCER_KEY = "library" as const;

export type Library = {
  id: string;
};

const libraryAdapter = createEntityAdapter<Library>();

const librarySlice = createSlice({
  name: "SHARE/library",
  initialState: libraryAdapter.getInitialState(),
  reducers: {
    upsertOne: libraryAdapter.upsertOne,
  },
});

export const { upsertOne } = librarySlice.actions;

export default librarySlice.reducer;
