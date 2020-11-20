import { createAction } from "@reduxjs/toolkit";
import { Offer } from "./library.service";
import { Library } from "./library.state";

export const createNewOffer = createAction<{
  offer: Offer;
}>("SHARE/library/createNewOffer");
