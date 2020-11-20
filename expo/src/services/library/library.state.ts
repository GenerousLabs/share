import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Offer } from "./library.service";

export const REDUCER_KEY = "library" as const;

export type Library = {
  id: string;
};

const offerAdapter = createEntityAdapter<Offer>();

const librarySlice = createSlice({
  name: "SHARE/library",
  initialState: offerAdapter.getInitialState(),
  reducers: {
    upsertOneOffer: offerAdapter.upsertOne,
  },
});

export const { upsertOneOffer } = librarySlice.actions;

export default librarySlice.reducer;
