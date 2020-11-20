import { createAction } from "@reduxjs/toolkit";
import { makeErrorActionCreator } from "../../utils/errors.utils";
import { Offer } from "./library.service";
import { Library } from "./library.state";

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
