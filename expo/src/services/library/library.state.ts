import {
  combineReducers,
  createAction,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { intersection, uniq } from "remeda";
import { OfferInRedux } from "../../shared.types";
import { RootState } from "../../store";
import { makeErrorActionCreator } from "../../utils/errors.utils";
import * as R from "remeda";

export const REDUCER_KEY = "library" as const;

const offerAdapter = createEntityAdapter<OfferInRedux>();

const offerSlice = createSlice({
  name: "SHARE/library/offers",
  initialState: offerAdapter.getInitialState(),
  reducers: {
    upsertOneOfferAction: offerAdapter.upsertOne,
    addOneOfferAction: offerAdapter.addOne,
  },
});

export const { upsertOneOfferAction, addOneOfferAction } = offerSlice.actions;

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
    setFilterTagsAction: (state, action: PayloadAction<{ tags: string[] }>) => {
      state.tags = action.payload.tags;
    },
  },
});

export const { setFilterTagsAction } = filterSlice.actions;

const libraryReducer = combineReducers({
  offers: offerSlice.reducer,
  filters: filterSlice.reducer,
});

export default libraryReducer;

export const { selectAll: selectAllOffers, selectById: selectOfferById } =
  offerAdapter.getSelectors((state: RootState) => state.library.offers);
export const selectAllOfferTags = createSelector(
  [selectAllOffers],
  (offers) => {
    const unsortedTags = R.flatMap(offers, (offer) => offer.tags);
    const tags = uniq(unsortedTags).sort();
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
export const createNewLibrarySagaAction =
  createAction<{
    title: string;
    bodyMarkdown: string;
  }>(CREATE_LIBRARY);
export const createNewLibraryErrorAction =
  makeErrorActionCreator(CREATE_LIBRARY);

const LOAD_OFFER = "SHARE/library/loadOffer" as const;
export const loadOfferSagaAction =
  createAction<{
    repoId: string;
    directoryPath: string;
    mine: boolean;
  }>(LOAD_OFFER);
export const loadOfferError = makeErrorActionCreator(LOAD_OFFER);
