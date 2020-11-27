import {
  createAction,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { OfferInRedux, OfferOnDisk } from "../../shared.types";
import { RootState } from "../../store";
import { makeErrorActionCreator } from "../../utils/errors.utils";

export const REDUCER_KEY = "library" as const;

const offerAdapter = createEntityAdapter<OfferInRedux>();

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

export const createNewOfferAction = createAction<{
  // There's no `id` passed to `createNewOffer()` it's generated
  offer: OfferOnDisk;
  repoId: string;
}>("SHARE/library/createNewOffer");

export const createNewOfferError = makeErrorActionCreator(
  "SHARE/library/createNewOffer"
);

const LOAD_OFFER = "SHARE/library/loadOffer" as const;
export const loadOfferAction = createAction<{
  repoId: string;
  directoryPath: string;
}>(LOAD_OFFER);

export const loadOfferError = makeErrorActionCreator(LOAD_OFFER);
