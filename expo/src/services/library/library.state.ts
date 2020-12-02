import {
  combineReducers,
  createAction,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { intersection, uniq } from "remeda";
import { OfferInRedux, OfferOnDisk } from "../../shared.types";
import { RootState } from "../../store";
import { makeErrorActionCreator } from "../../utils/errors.utils";

export const REDUCER_KEY = "library" as const;

const offerAdapter = createEntityAdapter<OfferInRedux>();

const offerSlice = createSlice({
  name: "SHARE/library/offers",
  initialState: offerAdapter.getInitialState(),
  reducers: {
    upsertOneOffer: offerAdapter.upsertOne,
  },
});

export const { upsertOneOffer } = offerSlice.actions;

type FilterState = {
  tags: string[];
};
const filterInitialState: FilterState = {
  tags: [],
};

const filterSlice = createSlice({
  name: "SHARE/library/filters",
  initialState: filterInitialState,
  reducers: {
    setFilterTags: (state, action: PayloadAction<{ tags: string[] }>) => {
      state.tags = action.payload.tags;
    },
  },
});

const libraryReducer = combineReducers({
  offers: offerSlice.reducer,
  filters: filterSlice.reducer,
});

export default libraryReducer;

export const { selectAll: selectAllOffers } = offerAdapter.getSelectors(
  (state: RootState) => state.library.offers
);
export const selectAllOfferTags = createSelector(
  [selectAllOffers],
  (offers) => {
    const tags = uniq(offers.flatMap((offer) => offer.tags)).sort();
    return tags;
  }
);
export const selectAllFilterTags = (state: RootState) =>
  state.library.filters.tags;
export const selectFilteredOffers = createSelector(
  [selectAllOffers, (state: RootState) => state.library.filters],
  (offers, filters) => {
    return offers.filter((offer) => {
      return intersection(offer.tags, filters.tags).length > 0;
    });
  }
);

const CREATE_LIBRARY = "SHARE/library/createNewLibrary";
export const createNewLibraryAction = createAction<{
  title: string;
  bodyMarkdown: string;
}>(CREATE_LIBRARY);
export const createNewLibraryErrorAction = makeErrorActionCreator(
  CREATE_LIBRARY
);

const CREATE_OFFER = "SHARE/library/createNewOffer";
export const createNewOfferSagaAction = createAction<{
  // There's no `id` passed to `createNewOffer()` it's generated
  offer: OfferOnDisk;
  repoId: string;
}>(CREATE_OFFER);
export const createNewOfferError = makeErrorActionCreator(CREATE_OFFER);

const LOAD_OFFER = "SHARE/library/loadOffer" as const;
export const loadOfferSagaAction = createAction<{
  repoId: string;
  directoryPath: string;
}>(LOAD_OFFER);
export const loadOfferError = makeErrorActionCreator(LOAD_OFFER);
