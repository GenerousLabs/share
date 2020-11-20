import { createAction } from "@reduxjs/toolkit";
import { Offer } from "./library.service";
import { Library } from "./library.state";

export const createNewOffer = createAction<{
  offer: Offer;
}>("SHARE/library/createNewOffer");

export const createNewOfferError = createAction<{
  message: string;
  repoId?: string;
}>("SHARE/library/createNewOffer/ERROR");
