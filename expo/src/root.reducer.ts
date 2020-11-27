import { combineReducers } from "@reduxjs/toolkit";
import connection, {
  REDUCER_KEY as connectionKey,
} from "./services/connection/connection.state";
import library, {
  REDUCER_KEY as libraryKey,
} from "./services/library/library.state";
import repo, { REDUCER_KEY as repoKey } from "./services/repo/repo.state";
import setup, { REDUCER_KEY as setupKey } from "./services/setup/setup.state";

const reducer = combineReducers({
  [connectionKey]: connection,
  [libraryKey]: library,
  [repoKey]: repo,
  [setupKey]: setup,
});

export default reducer;
