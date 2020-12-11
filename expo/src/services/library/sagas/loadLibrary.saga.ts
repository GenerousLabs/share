import { createAsyncPromiseSaga } from "../../../utils/saga.utils";

const saga = createAsyncPromiseSaga<{ input: string }, { output: string }>({
  prefix: "SHARE/library/loadLibrary",
  *effect(action) {
    return { output: "true" };
  },
});
