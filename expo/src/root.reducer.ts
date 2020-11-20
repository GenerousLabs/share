import { combineReducers } from "@reduxjs/toolkit";
import repo, { REDUCER_KEY as repoKey } from "./services/repo/repo.state";
import library, {
  REDUCER_KEY as libraryKey,
} from "./services/library/library.state";

const reducer = combineReducers({
  [repoKey]: repo,
  [libraryKey]: library,
});

export default reducer;
