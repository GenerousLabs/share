import {
  combineReducers,
  createAction,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { KeysBase64 } from "git-encrypted";
import { intersection, uniq } from "remeda";
import { OfferInRedux, OfferOnDisk } from "../../shared.types";
import { RootState } from "../../store";
import { makeErrorActionCreator } from "../../utils/errors.utils";
import { getTimestampSeconds } from "../../utils/time.utils";

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

export const { selectAll: selectAllOffers } = offerAdapter.getSelectors(
  (state: RootState) => state.library.offers
);
export const selectAllImportedOffers = createSelector(
  [selectAllOffers],
  (offers) => offers.filter((offer) => !offer.mine)
);
export const selectAllMyOffers = createSelector([selectAllOffers], (offers) =>
  offers.filter((offer) => offer.mine)
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

const SUBSCRIBE_LIBRARY = "SHARE/library/subscribeToLibrary";
/**
 * Given the name, url (including access credentials) and decryption keys,
 * subscribe to a repo that has been shared with you.
 */
export const subscribeToLibrarySagaAction = createAction<{
  remoteUrl: string;
  name: string;
  keysBase64: KeysBase64;
}>(SUBSCRIBE_LIBRARY);
export const subscribeToLibraryError = makeErrorActionCreator(
  SUBSCRIBE_LIBRARY
);

const CREATE_LIBRARY = "SHARE/library/createNewLibrary";
export const createNewLibrarySagaAction = createAction<{
  title: string;
  bodyMarkdown: string;
}>(CREATE_LIBRARY);
export const createNewLibraryErrorAction = makeErrorActionCreator(
  CREATE_LIBRARY
);

const LOAD_OFFER = "SHARE/library/loadOffer" as const;
export const loadOfferSagaAction = createAction<{
  repoId: string;
  directoryPath: string;
}>(LOAD_OFFER);
export const loadOfferError = makeErrorActionCreator(LOAD_OFFER);
