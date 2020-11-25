import {
  createAction,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { makeErrorActionCreator } from "../../utils/errors.utils";
import { Offer } from "./library.service";

export const REDUCER_KEY = "library" as const;

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

export const { selectAll: selectAllOffers } = offerAdapter.getSelectors(
  (state: RootState) => state.library
);

export const createNewOffer = createAction<{
  offer: Offer;
}>("SHARE/library/createNewOffer");

export const createNewOfferError = makeErrorActionCreator(
  "SHARE/library/createNewOffer"
);

const LOAD_OFFER = "SHARE/library/loadOffer" as const;
export const loadOffer = createAction<{
  repoId: string;
  directoryPath: string;
}>(LOAD_OFFER);

export const loadOfferError = makeErrorActionCreator(LOAD_OFFER);
