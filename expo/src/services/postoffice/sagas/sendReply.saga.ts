import { call, put } from "typed-redux-saga/macro";
import { PostofficeReply } from "../../../shared.types";
import { createAsyncPromiseSaga } from "../../../utils/saga.utils";
import { rootLogger } from "../../log/log.service";
import { sendReplyToPostoffice } from "../postoffice.service";
import { addOneReply, removeOneReply } from "../postoffice.state";
import { getPostofficeCodeParams } from "../postoffice.utils";

const log = rootLogger.extend("postoffice.fetchReplies");

const saga = createAsyncPromiseSaga<PostofficeReply, void>({
  prefix: "SHARE/postoffice/sendReply",
  *effect(action) {
    const reply = action.payload;

    yield* put(addOneReply(reply));

    yield* call(sendReplyToPostoffice, reply);

    yield* put(removeOneReply(reply.replyToPostofficeCode));
  },
});

export const { request: sendReplySagaAction, effect } = saga;

const sendReplySaga = saga.saga;
export default sendReplySaga;
