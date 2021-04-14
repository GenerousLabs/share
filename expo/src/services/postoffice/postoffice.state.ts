import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { PostofficeReply } from "../../shared.types";
import { RootState } from "../../store";
import { getPostofficeCodeParams } from "./postoffice.utils";

export const REDUCER_KEY = "postoffice";

const repliesAdapter = createEntityAdapter<PostofficeReply>({
  // Post offices are keyed by their code
  selectId: (reply) => reply.replyToPostofficeCode,
});

const slice = createSlice({
  name: "SHARE/postoffice/replies",
  initialState: repliesAdapter.getInitialState(),
  reducers: {
    removeOneReply: repliesAdapter.removeOne,
    addOneReply: repliesAdapter.addOne,
  },
});

export const { removeOneReply, addOneReply } = slice.actions;

export default slice.reducer;

const selectors = repliesAdapter.getSelectors(
  (state: RootState) => state[REDUCER_KEY]
);

export const { selectAll: selectAllReplies } = selectors;
